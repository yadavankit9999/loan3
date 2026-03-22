import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os

np.random.seed(42)

# ==========================
# CONFIG
# ==========================
N_ACCOUNTS = 1000  # Master list size
N_ASSOCIATES = 25
output_dir = "public/data/"

# Ensure directory exists
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

START_DATE = datetime(2022, 1, 1)
END_DATE = datetime(2026, 1, 1)

def random_date(start, end):
    return start + timedelta(days=random.randint(0, (end - start).days))

# ==========================
# DATA GENERATION
# ==========================

# Associates (Account Officers)
real_names = [
    "Sarah Jenkins", "Michael Chen", "David Rodriguez", "Emily Watson", "James Miller",
    "Jessica Taylor", "Robert Brown", "Lisa Williams", "John Smith", "Linda Garcia",
    "Richard Davis", "Susan Martinez", "Charles Wilson", "Karen Anderson", "Christopher Thomas",
    "Patricia Hernandez", "Matthew Moore", "Barbara Taylor", "Daniel Martin", "Nancy Jackson",
    "Joseph White", "Margaret Harris", "Thomas Thompson", "Sandra Garcia", "Donald Martinez"
]

associates_list = pd.DataFrame({
    "associate_id": range(1, len(real_names) + 1),
    "Account Officer": real_names,
    "Region": np.random.choice(["North", "South", "East", "West"], len(real_names)),
    "Experience": np.random.randint(1, 15, len(real_names))
})

# Master Loans/Accounts Data (3-Table Format Consolidation)
loan_types = ["Conventional", "ARM", "Foreign National", "Specialty", "Equity", "Construction", "Lot Loan"]
investor_codes = ["EWB-INT", "FNMA", "FHLMC", "GNMA", "PRIV"]
property_types = ["Residential Property (1-4 Units)", "Commercial & Multi-Family (5+ Units)"]
product_lines = {"CR1": "Consumer Residential", "SP1": "Specialty Portfolio", "HE1": "Home Equity", 
                 "LC1": "Land & Construction", "CE1": "Commercial Real Estate", "CS1": "Community & Specialty"}
stop_codes = ["BK", "FC", "LEG", "DIS", "M", "LOSS", "SII", "PIF", "REO", "TRNS"]
states = ["CA", "NY", "TX", "FL", "WA", "IL", "GA", "VA", "MA", "NJ"]

data = []
for i in range(1, N_ACCOUNTS + 1):
    loan_id = 1000000 + i
    days_past_due = int(np.random.choice([0, 30, 60, 90, 120, 150], p=[0.6, 0.15, 0.1, 0.08, 0.05, 0.02]))
    
    if days_past_due == 0:
        delinq_type = "Current"
    elif days_past_due < 60:
        delinq_type = "30-Day Delinquent"
    elif days_past_due < 90:
        delinq_type = "60-Day Delinquent"
    else:
        delinq_type = "90-Day Delinquent"
        
    orig_amt = np.random.randint(150000, 1500000)
    curr_bal = int(orig_amt * (random.uniform(0.5, 0.95)))
    appraisal_val = int(orig_amt * (random.uniform(0.9, 1.3)))
    
    prod_code = random.choice(list(product_lines.keys()))
    
    closing_date = random_date(START_DATE, END_DATE - timedelta(days=730))
    maturity_date = closing_date + timedelta(days=365*30)
    appraisal_date_orig = closing_date - timedelta(days=30)
    latest_appraisal_date = datetime.now() - timedelta(days=np.random.randint(30, 365*2))
    
    last_pay_date = random_date(datetime.now() - timedelta(days=60), datetime.now())
    contact_date = random_date(datetime.now() - timedelta(days=15), datetime.now())
    attempt_date = random_date(datetime.now() - timedelta(days=5), datetime.now())
    
    data.append({
        # TABLE 1: General Info
        "Bank": "East West Bank",
        "Account Number": f"EWB-{loan_id}",
        "Loan Type": random.choice(loan_types),
        "Investor Code": random.choice(investor_codes),
        "Borrower": f"Borrower {i}",
        "Property Address": f"{random.randint(100, 9999)} Main St, Unit {random.randint(1, 50)}",
        "Property Type": random.choice(property_types),
        "Product Line": prod_code,
        "State": random.choice(states),
        "Occup Code": random.choice([1, 2, 3, 4]),
        "Stop Code": random.choice(stop_codes),
        "Account Officer": random.choice(associates_list["Account Officer"]),

        # TABLE 2: Financials/Delinquency
        "Loan Closing Date": closing_date.strftime("%Y-%m-%d"),
        "Maturity Date": maturity_date.strftime("%Y-%m-%d"),
        "Next Payment Due Date": (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d"),
        "Payment Due Amount": random.randint(1000, 5000),
        "Delinquency Type": delinq_type,
        "# Days Past Due": days_past_due,
        "Total Bank Balance": curr_bal,
        "Charge off Amount": random.randint(0, 5000) if delinq_type == "90-Day Delinquent" else 0,
        "Orig Appraisal Amount": orig_amt,
        "Orig Appraisal Date": appraisal_date_orig.strftime("%Y-%m-%d"),
        "Appraisal Value": appraisal_val,
        "Appraisal Date": latest_appraisal_date.strftime("%Y-%m-%d"),

        # TABLE 3: Risk/Details
        "FICO": int(np.random.randint(580, 850)),
        "Total LTV": round((curr_bal / appraisal_val) * 100, 2),
        "Last Payment Received Date": last_pay_date.strftime("%Y-%m-%d"),
        "Last Payment Received Amount": random.randint(1000, 4000),
        "Suspense Balance": random.randint(0, 500),
        "DDA/Sav Acct#": f"SAV-{random.randint(10000, 99999)}",
        "DDA/Sav Account Balance": random.randint(500, 50000),
        "Latest Contact Date": contact_date.strftime("%Y-%m-%d"),
        "Latest Attempt Date": attempt_date.strftime("%Y-%m-%d"),
        "Resp 5/9": random.choice(["Y", "N", "NA"])
    })

loans_df = pd.DataFrame(data)

# Save
associates_list.to_csv(f"{output_dir}associates.csv", index=False)
loans_df.to_csv(f"{output_dir}loans.csv", index=False)

print(f"Data generated successfully in {output_dir}")
print(f"Loans Shape: {loans_df.shape}")
print(f"Columns: {list(loans_df.columns)}")
