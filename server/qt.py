import json
import os

# Print current working directory to ensure it's correct
print("Current working directory:", os.getcwd())

file_path = "furrme.sql"  # Use relative path

with open(file_path, "r", encoding="utf-8") as file:
    data = json.load(file)


def generate_sql_inserts(json_data):
    sql_statements = []
    for entry in json_data:
        if entry.get("type") == "table":
            table_name = entry["name"]
            rows = entry["data"]
            for row in rows:
                columns = ', '.join(f"`{k}`" for k in row)
                values = ', '.join(
                    f"'{str(v).replace('\'', '\\\'')}'" if v is not None else "NULL" for v in row.values()
                )
                sql = f"INSERT INTO `{table_name}` ({columns}) VALUES ({values});"
                sql_statements.append(sql)
    return sql_statements

# Generate the SQL
inserts = generate_sql_inserts(data)

# Save to file or print
with open("furrme-inserts.sql", "w", encoding="utf-8") as f:
    for line in inserts:
        f.write(line + "\n")

print("SQL insert statements saved to furrme-inserts.sql")
