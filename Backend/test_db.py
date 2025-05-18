from app import get_db_connection

def test_database_connection():
    try:
        # Attempt to connect to the database
        connection = get_db_connection()
        
        # Test executing a simple query
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            
            if result:
                print("✅ Database connection successful!")
                
                # Check if tables exist by querying information_schema
                cursor.execute("""
                    SELECT COUNT(*) as table_count 
                    FROM information_schema.tables 
                    WHERE table_schema = 'afya_mawinguni'
                """)
                table_info = cursor.fetchone()
                print(f"📊 Number of tables in database: {table_info['table_count']}")
                
                # List first 5 tables
                cursor.execute("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'afya_mawinguni'
                    LIMIT 5
                """)
                tables = cursor.fetchall()
                print("📋 Sample tables in database:")
                for table in tables:
                    print(f"  - {table['table_name']}")
                
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
