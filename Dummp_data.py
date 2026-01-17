import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

np.random.seed(42)

# ==========================
# CONFIG (CHANGE THESE)
# ==========================
N_ASSOCIATES = 25
N_ACCOUNTS = 5000
N_LOANS = 7000
N_ASSISTANCE = 3000

START_DATE = datetime(2022, 1, 1)
END_DATE = datetime(2026, 1, 1)

def random_date(start, end):
    return start + timedelta(days=random.randint(0, (end - start).days))

# ==========================
# 1️⃣ MORTGAGE ASSOCIATES
# ==========================
associates = pd.DataFrame({
    "associate_id": range(1, N_ASSOCIATES + 1),
    "associate_name": [f"Associate_{i}" for i in range(1, N_ASSOCIATES + 1)],
    "region": np.random.choice(["North", "South", "East", "West"], N_ASSOCIATES),
    "experience_years": np.random.randint(1, 15, N_ASSOCIATES)
})

# ==========================
# 2️⃣ MORTGAGE ACCOUNTS
# ==========================
accounts = pd.DataFrame({
    "account_id": range(1, N_ACCOUNTS + 1),
    "associate_id": np.random.choice(associates["associate_id"], N_ACCOUNTS),
    "origination_date": [random_date(START_DATE, END_DATE) for _ in range(N_ACCOUNTS)],
    "account_balance": np.random.randint(50000, 500000, N_ACCOUNTS),
    "is_migrated": np.random.choice([0, 1], N_ACCOUNTS, p=[0.75, 0.25]),
    "days_delinquent": np.random.choice(
        [0, 15, 30, 60, 90, 120],
        N_ACCOUNTS,
        p=[0.55, 0.15, 0.12, 0.10, 0.06, 0.02]
    ),
    "cured_flag": np.random.choice([0, 1], N_ACCOUNTS, p=[0.7, 0.3]),
    "last_payment_date": [random_date(START_DATE, END_DATE) for _ in range(N_ACCOUNTS)]
})

accounts["delinquency_status"] = pd.cut(
    accounts["days_delinquent"],
    bins=[-1, 0, 30, 60, 90, 999],
    labels=["Current", "Early", "30-60", "60-90", "90+"]
)

# ==========================
# 3️⃣ LOANS DATA
# ==========================
loans = pd.DataFrame({
    "loan_id": range(1, N_LOANS + 1),
    "customer_id": np.random.randint(10000, 99999, N_LOANS),
    "region": np.random.choice(["North", "South", "East", "West"], N_LOANS),
    "loan_amount": np.random.randint(100000, 2000000, N_LOANS),
    "credit_score": np.random.randint(500, 850, N_LOANS),
    "origination_date": [random_date(START_DATE, END_DATE) for _ in range(N_LOANS)],
    "loan_age_months": np.random.randint(1, 120, N_LOANS),
    "days_delinquent": np.random.choice(
        [0, 30, 60, 90, 120],
        N_LOANS,
        p=[0.7, 0.12, 0.08, 0.07, 0.03]
    )
})

loans["risk_segment"] = pd.cut(
    loans["credit_score"],
    bins=[0, 600, 680, 750, 850],
    labels=["High Risk", "Medium Risk", "Low Risk", "Very Low Risk"]
)

# ==========================
# 4️⃣ ASSISTANCE PROGRAMS
# ==========================
assistance_programs = pd.DataFrame({
    "program_id": [1, 2, 3, 4],
    "program_name": [
        "Forbearance",
        "Re-amortization",
        "Payment Deferral",
        "Hardship Modification"
    ],
    "max_allowed": [2, 1, 3, 1]
})

# ==========================
# 5️⃣ CUSTOMER ASSISTANCE HISTORY
# ==========================
customer_assistance = pd.DataFrame({
    "assistance_id": range(1, N_ASSISTANCE + 1),
    "loan_id": np.random.choice(loans["loan_id"], N_ASSISTANCE),
    "program_id": np.random.choice(assistance_programs["program_id"], N_ASSISTANCE),
    "assistance_start_date": [random_date(START_DATE, END_DATE) for _ in range(N_ASSISTANCE)],
    "duration_months": np.random.randint(1, 12, N_ASSISTANCE),
    "assistance_count_for_customer": np.random.randint(1, 5, N_ASSISTANCE),
    "successful_cure": np.random.choice([0, 1], N_ASSISTANCE, p=[0.4, 0.6]),
    "redefaulted": np.random.choice([0, 1], N_ASSISTANCE, p=[0.7, 0.3])
})

# ==========================
# SAVE FILES
# ==========================
output_dir = "public/data/"
associates.to_csv(f"{output_dir}associates.csv", index=False)
accounts.to_csv(f"{output_dir}accounts.csv", index=False)
loans.to_csv(f"{output_dir}loans.csv", index=False)
assistance_programs.to_csv(f"{output_dir}assistance_programs.csv", index=False)
customer_assistance.to_csv(f"{output_dir}customer_assistance.csv", index=False)

print("Dummy datasets generated successfully!")
