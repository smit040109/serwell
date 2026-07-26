#!/usr/bin/env python3
"""
Backend API Testing for VayuCodes CMS - Admin Login Bug Fix Verification
Tests all 11 verification points from the review request.
"""

import requests
import time
import json
from typing import Dict, Any

# Backend URL from .env
BASE_URL = "https://reels-player-2.preview.emergentagent.com/api"

# Admin credentials from test_credentials.md
ADMIN_EMAIL = "admin@vayucodes.com"
ADMIN_PASSWORD = "VayuAdmin@2026"

# Test results tracking
test_results = []

def log_test(test_num: str, description: str, passed: bool, details: str = ""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    result = f"{status} | Test {test_num}: {description}"
    if details:
        result += f"\n    Details: {details}"
    test_results.append((passed, result))
    print(result)

def test_1_health_endpoint():
    """Test 1: GET /api/health → 200 with {status:"ok", app:"vayucodes-cms", time:...}"""
    print("\n" + "="*80)
    print("TEST 1: Health Endpoint")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code != 200:
            log_test("1", "Health endpoint returns 200", False, f"Got {response.status_code}")
            return
        
        data = response.json()
        
        # Check required fields
        has_status = data.get("status") == "ok"
        has_app = data.get("app") == "vayucodes-cms"
        has_time = "time" in data
        
        if has_status and has_app and has_time:
            log_test("1", "Health endpoint returns correct payload", True, 
                    f"status={data['status']}, app={data['app']}, time={data['time']}")
        else:
            log_test("1", "Health endpoint returns correct payload", False,
                    f"Missing fields: status={has_status}, app={has_app}, time={has_time}")
    
    except Exception as e:
        log_test("1", "Health endpoint", False, f"Exception: {str(e)}")

def test_2_login_correct_credentials():
    """Test 2: POST /api/admin/login with correct credentials → 200 with token"""
    print("\n" + "="*80)
    print("TEST 2: Login with Correct Credentials")
    print("="*80)
    
    try:
        payload = {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }
        
        response = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code != 200:
            log_test("2", "Login with correct credentials returns 200", False, 
                    f"Got {response.status_code}")
            return None
        
        data = response.json()
        
        # Check for the error message that should NOT appear
        response_text = response.text.lower()
        if "mongodb_uri" in response_text or "mongo_url" in response_text or "not configured" in response_text:
            log_test("2", "Login does NOT show MongoDB config error", False,
                    "ERROR MESSAGE FOUND: 'MONGODB_URI / MONGO_URL not configured in environment'")
            return None
        
        # Check required fields
        has_token = "token" in data and isinstance(data["token"], str) and len(data["token"]) > 0
        has_admin = "admin" in data and isinstance(data["admin"], dict)
        
        if has_admin:
            admin = data["admin"]
            has_id = "id" in admin
            has_email = admin.get("email") == ADMIN_EMAIL
            has_name = "name" in admin
            has_role = "role" in admin
            
            if has_token and has_id and has_email and has_name and has_role:
                log_test("2", "Login with correct credentials returns token and admin details", True,
                        f"token={data['token'][:20]}..., admin.email={admin['email']}, admin.name={admin['name']}, admin.role={admin['role']}")
                return data["token"]
            else:
                log_test("2", "Login response has all required fields", False,
                        f"token={has_token}, id={has_id}, email={has_email}, name={has_name}, role={has_role}")
                return None
        else:
            log_test("2", "Login response has admin object", False, "admin object missing")
            return None
    
    except Exception as e:
        log_test("2", "Login with correct credentials", False, f"Exception: {str(e)}")
        return None

def test_3_login_wrong_password():
    """Test 3: POST /api/admin/login with wrong password → 401"""
    print("\n" + "="*80)
    print("TEST 3: Login with Wrong Password")
    print("="*80)
    
    try:
        payload = {
            "email": ADMIN_EMAIL,
            "password": "WrongPassword123!"
        }
        
        response = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 401:
            data = response.json()
            if data.get("error") == "Invalid credentials":
                log_test("3", "Login with wrong password returns 401 'Invalid credentials'", True)
            else:
                log_test("3", "Login with wrong password returns correct error message", False,
                        f"Got error: {data.get('error')}")
        else:
            log_test("3", "Login with wrong password returns 401", False,
                    f"Got {response.status_code}")
    
    except Exception as e:
        log_test("3", "Login with wrong password", False, f"Exception: {str(e)}")

def test_4_login_unknown_email():
    """Test 4: POST /api/admin/login with unknown email → 401"""
    print("\n" + "="*80)
    print("TEST 4: Login with Unknown Email")
    print("="*80)
    
    try:
        payload = {
            "email": "unknown@example.com",
            "password": ADMIN_PASSWORD
        }
        
        response = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 401:
            data = response.json()
            if data.get("error") == "Invalid credentials":
                log_test("4", "Login with unknown email returns 401 'Invalid credentials'", True)
            else:
                log_test("4", "Login with unknown email returns correct error message", False,
                        f"Got error: {data.get('error')}")
        else:
            log_test("4", "Login with unknown email returns 401", False,
                    f"Got {response.status_code}")
    
    except Exception as e:
        log_test("4", "Login with unknown email", False, f"Exception: {str(e)}")

def test_5_login_missing_password():
    """Test 5: POST /api/admin/login with missing password → 400"""
    print("\n" + "="*80)
    print("TEST 5: Login with Missing Password")
    print("="*80)
    
    try:
        payload = {
            "email": ADMIN_EMAIL
        }
        
        response = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 400:
            data = response.json()
            if data.get("error") == "Password is required":
                log_test("5", "Login with missing password returns 400 'Password is required'", True)
            else:
                log_test("5", "Login with missing password returns correct error message", False,
                        f"Got error: {data.get('error')}")
        else:
            log_test("5", "Login with missing password returns 400", False,
                    f"Got {response.status_code}")
    
    except Exception as e:
        log_test("5", "Login with missing password", False, f"Exception: {str(e)}")

def test_6_login_malformed_email():
    """Test 6: POST /api/admin/login with malformed email → 400"""
    print("\n" + "="*80)
    print("TEST 6: Login with Malformed Email")
    print("="*80)
    
    try:
        payload = {
            "email": "notanemail",
            "password": ADMIN_PASSWORD
        }
        
        response = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 400:
            data = response.json()
            error_msg = data.get("error", "").lower()
            if "email" in error_msg and "valid" in error_msg:
                log_test("6", "Login with malformed email returns 400 with email validation error", True,
                        f"Error: {data.get('error')}")
            else:
                log_test("6", "Login with malformed email returns correct error message", False,
                        f"Got error: {data.get('error')}")
        else:
            log_test("6", "Login with malformed email returns 400", False,
                    f"Got {response.status_code}")
    
    except Exception as e:
        log_test("6", "Login with malformed email", False, f"Exception: {str(e)}")

def test_7_admin_me_with_token(token: str):
    """Test 7: GET /api/admin/me with valid token → 200 with admin details"""
    print("\n" + "="*80)
    print("TEST 7: GET /api/admin/me with Valid Token")
    print("="*80)
    
    if not token:
        log_test("7", "GET /api/admin/me with valid token", False, "No token available from test 2")
        return
    
    try:
        headers = {
            "Authorization": f"Bearer {token}"
        }
        
        response = requests.get(f"{BASE_URL}/admin/me", headers=headers, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code != 200:
            log_test("7", "GET /api/admin/me with valid token returns 200", False,
                    f"Got {response.status_code}")
            return
        
        data = response.json()
        
        if "admin" in data:
            admin = data["admin"]
            has_id = "id" in admin
            has_email = admin.get("email") == ADMIN_EMAIL
            has_name = "name" in admin
            has_role = "role" in admin
            
            if has_id and has_email and has_name and has_role:
                log_test("7", "GET /api/admin/me returns admin details", True,
                        f"admin.email={admin['email']}, admin.name={admin['name']}, admin.role={admin['role']}")
            else:
                log_test("7", "GET /api/admin/me returns all required fields", False,
                        f"id={has_id}, email={has_email}, name={has_name}, role={has_role}")
        else:
            log_test("7", "GET /api/admin/me returns admin object", False, "admin object missing")
    
    except Exception as e:
        log_test("7", "GET /api/admin/me with valid token", False, f"Exception: {str(e)}")

def test_8_admin_me_without_token():
    """Test 8: GET /api/admin/me without token → 401"""
    print("\n" + "="*80)
    print("TEST 8: GET /api/admin/me without Token")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/admin/me", timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 401:
            log_test("8", "GET /api/admin/me without token returns 401", True)
        else:
            log_test("8", "GET /api/admin/me without token returns 401", False,
                    f"Got {response.status_code}")
    
    except Exception as e:
        log_test("8", "GET /api/admin/me without token", False, f"Exception: {str(e)}")

def test_9_rate_limiting():
    """Test 9: Rate limiting - 6 rapid login attempts → 429"""
    print("\n" + "="*80)
    print("TEST 9: Rate Limiting (6 rapid login attempts)")
    print("="*80)
    
    try:
        # Wait a bit to ensure rate limit bucket is fresh
        print("Waiting 2 seconds before starting rate limit test...")
        time.sleep(2)
        
        payload = {
            "email": ADMIN_EMAIL,
            "password": "WrongPasswordForRateLimitTest"
        }
        
        responses = []
        for i in range(6):
            response = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
            responses.append(response)
            print(f"Attempt {i+1}: Status {response.status_code}")
            
            # Check for rate limit headers
            if "X-RateLimit-Limit" in response.headers:
                print(f"  X-RateLimit-Limit: {response.headers.get('X-RateLimit-Limit')}")
                print(f"  X-RateLimit-Remaining: {response.headers.get('X-RateLimit-Remaining')}")
                print(f"  X-RateLimit-Reset: {response.headers.get('X-RateLimit-Reset')}")
        
        # Check if 6th attempt returns 429
        sixth_response = responses[5]
        
        if sixth_response.status_code == 429:
            data = sixth_response.json()
            has_rate_limit_headers = (
                "X-RateLimit-Limit" in sixth_response.headers or
                "X-RateLimit-Remaining" in sixth_response.headers or
                "X-RateLimit-Reset" in sixth_response.headers
            )
            
            if has_rate_limit_headers:
                log_test("9", "Rate limiting returns 429 with X-RateLimit-* headers on 6th attempt", True,
                        f"Error: {data.get('error')}")
            else:
                log_test("9", "Rate limiting returns 429 but missing X-RateLimit-* headers", False,
                        "X-RateLimit-* headers not found")
        else:
            # Check if any earlier attempt hit rate limit
            rate_limited = False
            for i, resp in enumerate(responses):
                if resp.status_code == 429:
                    rate_limited = True
                    log_test("9", f"Rate limiting triggered on attempt {i+1}", True,
                            f"Status: {resp.status_code}")
                    break
            
            if not rate_limited:
                log_test("9", "Rate limiting returns 429 on 6th attempt", False,
                        f"6th attempt returned {sixth_response.status_code} instead of 429")
    
    except Exception as e:
        log_test("9", "Rate limiting test", False, f"Exception: {str(e)}")

def test_10_regression_cms_endpoints():
    """Test 10: Regression - GET /api/cms/site_settings, page_content, team_members"""
    print("\n" + "="*80)
    print("TEST 10: Regression - CMS Endpoints")
    print("="*80)
    
    # Test 10a: site_settings
    try:
        response = requests.get(f"{BASE_URL}/cms/site_settings", timeout=10)
        print(f"\n10a. GET /api/cms/site_settings")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if "data" in data and data["data"].get("_id") == "main":
                log_test("10a", "GET /api/cms/site_settings returns 200 with _id='main'", True,
                        f"Found site_settings with _id='main'")
            else:
                log_test("10a", "GET /api/cms/site_settings returns correct structure", False,
                        f"Missing _id='main' in response")
        else:
            log_test("10a", "GET /api/cms/site_settings returns 200", False,
                    f"Got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("10a", "GET /api/cms/site_settings", False, f"Exception: {str(e)}")
    
    # Test 10b: page_content
    try:
        response = requests.get(f"{BASE_URL}/cms/page_content", timeout=10)
        print(f"\n10b. GET /api/cms/page_content")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if "data" in data and isinstance(data["data"], list):
                pages = data["data"]
                expected_keys = ["home", "why-us", "digital-marketing", "our-work", "contact"]
                found_keys = [p.get("key") for p in pages if "key" in p]
                
                if len(pages) >= 5:
                    matching_keys = [k for k in expected_keys if k in found_keys]
                    log_test("10b", "GET /api/cms/page_content returns 5+ entries", True,
                            f"Found {len(pages)} pages with keys: {found_keys}")
                else:
                    log_test("10b", "GET /api/cms/page_content returns 5+ entries", False,
                            f"Found only {len(pages)} pages: {found_keys}")
            else:
                log_test("10b", "GET /api/cms/page_content returns array", False,
                        "Response missing 'data' array")
        else:
            log_test("10b", "GET /api/cms/page_content returns 200", False,
                    f"Got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("10b", "GET /api/cms/page_content", False, f"Exception: {str(e)}")
    
    # Test 10c: team_members
    try:
        response = requests.get(f"{BASE_URL}/cms/team_members", timeout=10)
        print(f"\n10c. GET /api/cms/team_members")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if "data" in data and isinstance(data["data"], list):
                members = data["data"]
                cofounders = [m for m in members if m.get("isCoFounder") == True]
                
                if len(cofounders) >= 2:
                    names = [m.get("name") for m in cofounders]
                    log_test("10c", "GET /api/cms/team_members returns 2+ co-founders", True,
                            f"Found {len(cofounders)} co-founders: {names}")
                else:
                    log_test("10c", "GET /api/cms/team_members returns 2+ co-founders", False,
                            f"Found only {len(cofounders)} co-founders")
            else:
                log_test("10c", "GET /api/cms/team_members returns array", False,
                        "Response missing 'data' array")
        else:
            log_test("10c", "GET /api/cms/team_members returns 200", False,
                    f"Got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("10c", "GET /api/cms/team_members", False, f"Exception: {str(e)}")

def test_11_contact_form():
    """Test 11: Contact form - POST /api/contact with valid payload"""
    print("\n" + "="*80)
    print("TEST 11: Contact Form Submission")
    print("="*80)
    
    try:
        payload = {
            "name": "Rajesh Kumar",
            "email": "rajesh.kumar@example.com",
            "phone": "+91 98765 43210",
            "business": "Tech Solutions Pvt Ltd",
            "message": "We are interested in your digital transformation services for our enterprise. Please contact us to discuss further.",
            "sessionId": f"test-session-{int(time.time())}",
            "visitorId": f"test-visitor-{int(time.time())}",
            "referrer": "https://google.com",
            "utm_source": "test",
            "utm_medium": "backend_test",
            "utm_campaign": "admin_login_verification"
        }
        
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True and "id" in data:
                log_test("11", "POST /api/contact with valid payload returns 200 {ok:true, id:...}", True,
                        f"Lead created with id: {data['id']}")
            else:
                log_test("11", "POST /api/contact returns correct response structure", False,
                        f"Missing ok:true or id field")
        else:
            log_test("11", "POST /api/contact returns 200", False,
                    f"Got {response.status_code}: {response.text}")
    
    except Exception as e:
        log_test("11", "POST /api/contact", False, f"Exception: {str(e)}")

def print_summary():
    """Print test summary"""
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for p, _ in test_results if p)
    total = len(test_results)
    
    print(f"\nTotal Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total*100):.1f}%\n")
    
    print("Detailed Results:")
    print("-" * 80)
    for _, result in test_results:
        print(result)
    
    print("\n" + "="*80)
    if passed == total:
        print("🎉 ALL TESTS PASSED - Admin login bug fix VERIFIED!")
    else:
        print("⚠️  SOME TESTS FAILED - Review details above")
    print("="*80)

def main():
    """Run all tests"""
    print("="*80)
    print("VayuCodes CMS - Admin Login Bug Fix Verification")
    print("="*80)
    print(f"Backend URL: {BASE_URL}")
    print(f"Admin Email: {ADMIN_EMAIL}")
    print(f"Testing 11 verification points...")
    print("="*80)
    
    # Run tests in sequence
    test_1_health_endpoint()
    
    # Test 2 returns token for use in test 7
    token = test_2_login_correct_credentials()
    
    test_3_login_wrong_password()
    test_4_login_unknown_email()
    test_5_login_missing_password()
    test_6_login_malformed_email()
    test_7_admin_me_with_token(token)
    test_8_admin_me_without_token()
    test_9_rate_limiting()
    test_10_regression_cms_endpoints()
    test_11_contact_form()
    
    # Print summary
    print_summary()

if __name__ == "__main__":
    main()
