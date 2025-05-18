import pymysql
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database credentials from .env
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = int(os.getenv('DB_PORT', 3306))
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'Fyaman42')
DB_NAME = os.getenv('DB_NAME', 'afya_mawinguni')

def test_database_connection():
    try:
        print(f"Attempting to connect to MySQL database: {DB_NAME} on {DB_HOST}:{DB_PORT}")
        # Attempt to connect to the database
        connection = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            db=DB_NAME,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        print("✅ Database connection successful!")
        
        # Test executing a simple query
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1 as test")
            result = cursor.fetchone()
            print(f"Test query result: {result}")
            
            # Check if tables exist by querying information_schema
            cursor.execute("""
                SELECT COUNT(*) as table_count 
                FROM information_schema.tables 
                WHERE table_schema = %s
            """, (DB_NAME,))
            table_info = cursor.fetchone()
            print(f"📊 Number of tables in database: {table_info['table_count']}")
            
            # List all tables
            if table_info['table_count'] > 0:
                cursor.execute("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = %s
                """, (DB_NAME,))
                tables = cursor.fetchall()
                print("📋 Tables in database:")
                for table in tables:
                    print(f"  - {table['table_name']}")
                
                # Test a query on the users table if it exists
                table_names = [t['table_name'] for t in tables]
                if 'users' in table_names:
                    print("\nTesting query on users table:")
                    cursor.execute("SELECT COUNT(*) as user_count FROM users")
                    user_count = cursor.fetchone()
                    print(f"Number of users in the system: {user_count['user_count']}")
            
            return True
            
    except Exception as e:
        print(f"❌ Database connection failed with error: {e}")
        return False
    finally:
        if 'connection' in locals() and connection:
            connection.close()
            print("🔒 Connection closed")

if __name__ == "__main__":
    test_database_connection()
