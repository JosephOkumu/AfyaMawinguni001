import pymysql
from config import Config

def test_database_connection():
    try:
        # Try to establish a connection
        conn = pymysql.connect(
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            db=Config.DB_NAME,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        # If connection is successful
        print("✅ Connection to MySQL database successful!")
        
        # Try to execute a simple query to check database functionality
        with conn.cursor() as cursor:
            # Get all tables in the database
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            
            if tables:
                print(f"\n📋 Tables in '{Config.DB_NAME}' database:")
                for i, table in enumerate(tables, 1):
                    table_name = list(table.values())[0]
                    print(f"  {i}. {table_name}")
                    
                    # Get column information for each table
                    cursor.execute(f"DESCRIBE {table_name}")
                    columns = cursor.fetchall()
                    print(f"     Columns: {len(columns)}")
            else:
                print(f"\n⚠️ No tables found in '{Config.DB_NAME}' database.")
        
        conn.close()
        return True
    
    except pymysql.OperationalError as e:
        error_code = e.args[0]
        if error_code == 1045:  # Access denied error
            print("❌ Error: Access denied. Invalid username or password.")
        elif error_code == 1049:  # Unknown database error
            print(f"❌ Error: Database '{Config.DB_NAME}' does not exist.")
        elif error_code == 2003:  # Server not found error
            print(f"❌ Error: Could not connect to server '{Config.DB_HOST}:{Config.DB_PORT}'.")
        else:
            print(f"❌ Error connecting to database: {e}")
        return False
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_database_connection()
