#!/usr/bin/env python3
"""
Contact Form API Validation Test Suite
Tests all 10 validation scenarios for /api/contact endpoint as per review request
"""

import requests
import json

BASE_URL = "https://06fbfc4e-347b-41d8-b0a5-7ca0f9c8303f.preview.emergentagent.com/api"

def print_test(name, passed, details=""):
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status} | {name}")
    if details:
        print(f"    {details}")
    print()

def test_health():
    """Test: GET /api/health returns 200 with status ok"""
    try:
        resp = requests.get(f"{BASE_URL}/health", timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            data.get("status") == "ok"
        )
        print_test("Health Check", passed, f"Status: {resp.status_code}, Response: {data}")
        return passed
    except Exception as e:
        print_test("Health Check", False, f"Error: {str(e)}")
        return False

def test_contact_settings():
    """Test: GET /api/cms/contact_settings returns 200 (not 500)"""
    try:
        resp = requests.get(f"{BASE_URL}/cms/contact_settings", timeout=10)
        data = resp.json()
        passed = resp.status_code == 200
        print_test("Contact Settings Endpoint", passed, f"Status: {resp.status_code}, Response: {data}")
        return passed
    except Exception as e:
        print_test("Contact Settings Endpoint", False, f"Error: {str(e)}")
        return False

def test_valid_payload():
    """Test 1: Valid payload → 200 with { ok: true, id: <uuid> }"""
    try:
        payload = {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+91 98765 43210",
            "business": "Acme",
            "message": "Hi, this is a test message longer than 10 chars."
        }
        resp = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            data.get("ok") == True and
            "id" in data
        )
        print_test("Test 1: Valid Payload", passed, f"Status: {resp.status_code}, Response: {data}")
        return passed
    except Exception as e:
        print_test("Test 1: Valid Payload", False, f"Error: {str(e)}")
        return False

def test_missing_name():
    """Test 2: Missing name (empty string) → 400 with error message about name required"""
    try:
        payload = {
            "name": "",
            "email": "john@example.com",
            "message": "Hello there this is fine."
        }
        resp = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 400 and
            "error" in data and
            "name" in data["error"].lower() and
            "required" in data["error"].lower()
        )
        print_test("Test 2: Missing Name (Empty String)", passed, f"Status: {resp.status_code}, Response: {data}")
        return passed
    except Exception as e:
        print_test("Test 2: Missing Name (Empty String)", False, f"Error: {str(e)}")
        return False

def test_invalid_email_format():
    """Test 3: Invalid email format → 400 with 'Enter a valid email'"""
    try:
        payload = {
            "name": "John",
            "email": "notanemail",
            "message": "Hello there this is fine."
        }
        resp = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 400 and
            "error" in data and
            "valid email" in data["error"].lower()
        )
        print_test("Test 3: Invalid Email Format", passed, f"Status: {resp.status_code}, Response: {data}")
        return passed
    except Exception as e:
        print_test("Test 3: Invalid Email Format", False, f"Error: {str(e)}")
        return False

def test_missing_email():
    """Test 4: Missing email → 400 with 'Email is required'"""
    try:
        payload = {
            "name": "John",
            "email": "",
            "message": "Hello there this is fine."
        }
        resp = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 400 and
            "error" in data and
            "email" in data["error"].lower() and
            "required" in data["error"].lower()
        )
        print_test("Test 4: Missing Email", passed, f"Status: {resp.status_code}, Response: {data}")
        return passed
    except Exception as e:
        print_test("Test 4: Missing Email", False, f"Error: {str(e)}")
        return False

def test_invalid_name_with_digits():
    """Test 5: Invalid name (contains digits) → 400 with 'Enter a valid name'"""
    try:
        payload = {
            "name": "John123",
            "email": "john@example.com",
            "message": "Hello there this is fine."
        }
        resp = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 400 and
            "error" in data and
            "valid name" in data["error"].lower()
        )
        print_test("Test 5: Invalid Name (Contains Digits)", passed, f"Status: {resp.status_code}, Response: {data}")
        return passed
    except Exception as e:
        print_test("Test 5: Invalid Name (Contains Digits)", False, f"Error: {str(e)}")
        return False

def test_missing_message():
    """Test 6: Missing message → 400 with 'Message is required'"""
    try:
        payload = {
            "name": "John",
            "email": "john@example.com",
            "message": ""
        }
        resp = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 400 and
            "error" in data and
            "message" in data["error"].lower() and
            "required" in data["error"].lower()
        )
        print_test("Test 6: Missing Message", passed, f"Status: {resp.status_code}, Response: {data}")
        return passed
    except Exception as e:
        print_test("Test 6: Missing Message", False, f"Error: {str(e)}")
        return False

def test_short_message():
    """Test 7: Short message (<10 chars) → 400 with 'Message is too short'"""
    try:
        payload = {
            "name": "John",
            "email": "john@example.com",
            "message": "hey"
        }
        resp = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 400 and
            "error" in data and
            "message" in data["error"].lower() and
            ("short" in data["error"].lower() or "too short" in data["error"].lower())
        )
        print_test("Test 7: Short Message (<10 chars)", passed, f"Status: {resp.status_code}, Response: {data}")
        return passed
    except Exception as e:
        print_test("Test 7: Short Message (<10 chars)", False, f"Error: {str(e)}")
        return False

def test_valid_phone_number():
    """Test 8: Valid phone number → 200 ok"""
    try:
        payload = {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+91 98765 43210",
            "message": "Please build me a website that converts."
        }
        resp = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            data.get("ok") == True and
            "id" in data
        )
        print_test("Test 8: Valid Phone Number", passed, f"Status: {resp.status_code}, Response: {data}")
        return passed
    except Exception as e:
        print_test("Test 8: Valid Phone Number", False, f"Error: {str(e)}")
        return False

def test_invalid_phone():
    """Test 9: Invalid phone → 400 with 'Enter a valid phone number'"""
    try:
        payload = {
            "name": "John",
            "email": "john@example.com",
            "phone": "abcxyz!!",
            "message": "Please build me a website that converts."
        }
        resp = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 400 and
            "error" in data and
            "phone" in data["error"].lower() and
            "valid" in data["error"].lower()
        )
        print_test("Test 9: Invalid Phone", passed, f"Status: {resp.status_code}, Response: {data}")
        return passed
    except Exception as e:
        print_test("Test 9: Invalid Phone", False, f"Error: {str(e)}")
        return False

def test_phone_omitted():
    """Test 10: Phone omitted (optional) → 200 ok"""
    try:
        payload = {
            "name": "Jane",
            "email": "jane@example.com",
            "message": "A message longer than 10 chars for testing."
        }
        resp = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            data.get("ok") == True and
            "id" in data
        )
        print_test("Test 10: Phone Omitted (Optional)", passed, f"Status: {resp.status_code}, Response: {data}")
        return passed
    except Exception as e:
        print_test("Test 10: Phone Omitted (Optional)", False, f"Error: {str(e)}")
        return False

def main():
    print("\n" + "="*80)
    print("CONTACT FORM API VALIDATION TEST SUITE")
    print("="*80 + "\n")
    
    all_results = []
    
    # Prerequisite tests
    print("--- PREREQUISITE TESTS ---\n")
    all_results.append(test_health())
    all_results.append(test_contact_settings())
    
    # Contact form validation tests
    print("\n--- CONTACT FORM VALIDATION TESTS ---\n")
    all_results.append(test_valid_payload())
    all_results.append(test_missing_name())
    all_results.append(test_invalid_email_format())
    all_results.append(test_missing_email())
    all_results.append(test_invalid_name_with_digits())
    all_results.append(test_missing_message())
    all_results.append(test_short_message())
    all_results.append(test_valid_phone_number())
    all_results.append(test_invalid_phone())
    all_results.append(test_phone_omitted())
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    passed = sum(all_results)
    total = len(all_results)
    print(f"\nTotal: {passed}/{total} tests passed")
    print(f"Success rate: {(passed/total)*100:.1f}%\n")
    
    if passed == total:
        print("✅ ALL TESTS PASSED - Contact form validation is working correctly!")
    else:
        print(f"❌ {total - passed} TEST(S) FAILED - See details above")
    
    return passed == total

if __name__ == "__main__":
    import sys
    success = main()
    sys.exit(0 if success else 1)
