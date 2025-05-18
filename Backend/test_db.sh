#!/bin/bash

# Color codes for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Database credentials
MYSQL_HOST="localhost"
MYSQL_PORT=3306
MYSQL_USER="root"
MYSQL_PASS="Fyaman42"
MYSQL_DB="afya_mawinguni"

echo -e "${CYAN}Testing connection to MySQL database: ${MYSQL_DB}${NC}"
echo ""

# Step 1: Check if mysql client is available
echo -e "${YELLOW}Step 1: Checking if MySQL client is installed${NC}"
if command -v mysql >/dev/null 2>&1; then
    echo -e "${GREEN}✅ MySQL client is installed${NC}"
else
    echo -e "${RED}❌ MySQL client not found. Please install it with:${NC}"
    echo -e "   sudo apt-get install mysql-client"
    exit 1
fi

# Step 2: Test TCP connection to MySQL server
echo -e "\n${YELLOW}Step 2: Testing TCP connection to MySQL server (${MYSQL_HOST}:${MYSQL_PORT})${NC}"
if nc -z -w5 ${MYSQL_HOST} ${MYSQL_PORT}; then
    echo -e "${GREEN}✅ TCP Connection successful! MySQL server is listening on port ${MYSQL_PORT}${NC}"
else
    echo -e "${RED}❌ TCP Connection failed! MySQL server is not accessible on port ${MYSQL_PORT}${NC}"
    echo -e "${RED}   Possible issues:${NC}"
    echo -e "${RED}   - MySQL service might not be running${NC}"
    echo -e "${RED}   - Firewall might be blocking the connection${NC}"
    echo -e "${RED}   - MySQL might be configured to use a different port${NC}"
    
    # Try to check MySQL service status
    echo -e "\n${YELLOW}Checking MySQL service status:${NC}"
    service mysql status >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "$(service mysql status 2>/dev/null | grep Active:)"
    else
        echo -e "${RED}Unable to check MySQL service status${NC}"
    fi
fi

# Step 3: Try to connect to the database
echo -e "\n${YELLOW}Step 3: Testing MySQL authentication and database access${NC}"
mysql -h"${MYSQL_HOST}" -P"${MYSQL_PORT}" -u"${MYSQL_USER}" -p"${MYSQL_PASS}" -e "SELECT 1" >/dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Authentication successful! Credentials are valid.${NC}"
    
    # Check if database exists
    mysql -h"${MYSQL_HOST}" -P"${MYSQL_PORT}" -u"${MYSQL_USER}" -p"${MYSQL_PASS}" -e "USE ${MYSQL_DB}" >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database '${MYSQL_DB}' exists!${NC}"
        
        # Count tables in database
        TABLE_COUNT=$(mysql -h"${MYSQL_HOST}" -P"${MYSQL_PORT}" -u"${MYSQL_USER}" -p"${MYSQL_PASS}" -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='${MYSQL_DB}'" -sN)
        echo -e "${CYAN}📊 Number of tables in database: ${TABLE_COUNT}${NC}"
        
        # List all tables if tables exist
        if [ "$TABLE_COUNT" -gt 0 ]; then
            echo -e "${CYAN}📋 Tables in database:${NC}"
            TABLES=$(mysql -h"${MYSQL_HOST}" -P"${MYSQL_PORT}" -u"${MYSQL_USER}" -p"${MYSQL_PASS}" -e "SELECT table_name FROM information_schema.tables WHERE table_schema='${MYSQL_DB}'" -sN)
            for TABLE in $TABLES; do
                echo -e "  - ${TABLE}"
            done
            
            # If users table exists, check user count
            if echo "$TABLES" | grep -q "users"; then
                USER_COUNT=$(mysql -h"${MYSQL_HOST}" -P"${MYSQL_PORT}" -u"${MYSQL_USER}" -p"${MYSQL_PASS}" -e "SELECT COUNT(*) FROM ${MYSQL_DB}.users" -sN)
                echo -e "\n${CYAN}Testing query on users table:${NC}"
                echo -e "Number of users in the system: ${USER_COUNT}"
            fi
        else
            echo -e "${YELLOW}⚠️ Database exists but contains no tables${NC}"
        fi
    else
        echo -e "${RED}❌ Database '${MYSQL_DB}' does not exist!${NC}"
    fi
else
    echo -e "${RED}❌ Authentication failed! Credentials might be incorrect.${NC}"
fi

echo -e "\n${YELLOW}Database Connection Summary:${NC}"
echo -e "${YELLOW}======================================${NC}"
echo -e "${CYAN}Host: ${MYSQL_HOST}${NC}"
echo -e "${CYAN}Port: ${MYSQL_PORT}${NC}"
echo -e "${CYAN}User: ${MYSQL_USER}${NC}"
echo -e "${CYAN}Database: ${MYSQL_DB}${NC}"
echo -e "${YELLOW}======================================${NC}"

echo -e "\n${YELLOW}Recommendations:${NC}"
echo -e "1. Make sure MySQL server is installed and running"
echo -e "2. Verify credentials in your .env file are correct"
echo -e "3. Try creating/importing the schema with: mysql -u ${MYSQL_USER} -p < database_schema.sql"
echo -e "4. Check if the database exists: mysql -u ${MYSQL_USER} -p -e 'SHOW DATABASES;'"
