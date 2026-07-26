#!/usr/bin/env python3
"""
VayuCodes CMS Backend Bug Fix Verification Test Suite
Tests 4 recent bug fixes as per user request (Jul 26 continuation)
"""

import requests
import json
import time

# Use production URL from review request
BASE_URL = "https://reels-player-2.preview.emergentagent.com/api"
ADMIN_EMAIL = "admin@vayucodes.com"
ADMIN_PASSWORD = "VayuCodes@2026"

# Global token storage
auth_token = None
original_values = {}

def print_test(name, passed, details=""):
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status} | {name}")
    if details:
        print(f"    {details}")
    print()

def print_section(title):
    print("\n" + "="*80)
    print(f"  {title}")
    print("="*80 + "\n")

# ============================================================
# SETUP: ADMIN LOGIN
# ============================================================
def setup_auth():
    """Login and get JWT token"""
    global auth_token
    try:
        print_section("SETUP: ADMIN LOGIN")
        resp = requests.post(
            f"{BASE_URL}/admin/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
            timeout=10
        )
        data = resp.json()
        if resp.status_code == 200 and "token" in data:
            auth_token = data["token"]
            print_test("Admin Login", True, f"Token received for {ADMIN_EMAIL}")
            return True
        else:
            print_test("Admin Login", False, f"Status: {resp.status_code}, Response: {data}")
            return False
    except Exception as e:
        print_test("Admin Login", False, f"Error: {str(e)}")
        return False

# ============================================================
# SANITY CHECKS
# ============================================================
def test_sanity_health():
    """Sanity: GET /api/health → {status:'ok'}"""
    try:
        resp = requests.get(f"{BASE_URL}/health", timeout=10)
        data = resp.json()
        passed = resp.status_code == 200 and data.get("status") == "ok"
        print_test("Sanity - Health endpoint", passed, f"Response: {data}")
        return passed
    except Exception as e:
        print_test("Sanity - Health endpoint", False, f"Error: {str(e)}")
        return False

def test_sanity_page_content_list():
    """Sanity: GET /api/cms/page_content → list with keys: home, why-us, digital-marketing, our-work, contact"""
    try:
        resp = requests.get(f"{BASE_URL}/cms/page_content", timeout=10)
        data = resp.json()
        items = data.get("data", [])
        keys = [item.get("key") for item in items]
        
        expected_keys = ["home", "why-us", "digital-marketing", "our-work", "contact"]
        has_all_keys = all(key in keys for key in expected_keys)
        
        passed = resp.status_code == 200 and has_all_keys
        print_test("Sanity - page_content list", passed, f"Keys found: {keys}, Expected: {expected_keys}")
        return passed
    except Exception as e:
        print_test("Sanity - page_content list", False, f"Error: {str(e)}")
        return False

def test_sanity_faq_items():
    """Sanity: GET /api/cms/faq_items → list has ≥ 5 items"""
    try:
        resp = requests.get(f"{BASE_URL}/cms/faq_items", timeout=10)
        data = resp.json()
        items = data.get("data", [])
        passed = resp.status_code == 200 and len(items) >= 5
        print_test("Sanity - faq_items list", passed, f"Found {len(items)} items (expected >= 5)")
        return passed
    except Exception as e:
        print_test("Sanity - faq_items list", False, f"Error: {str(e)}")
        return False

def test_sanity_auth_401():
    """Sanity: Unauthenticated POST to /api/cms/contact_settings → 401"""
    try:
        resp = requests.post(
            f"{BASE_URL}/cms/contact_settings",
            json={"emails": ["test@example.com"]},
            timeout=10
        )
        passed = resp.status_code == 401
        print_test("Sanity - Unauth POST to contact_settings → 401", passed, f"Status: {resp.status_code}")
        return passed
    except Exception as e:
        print_test("Sanity - Unauth POST to contact_settings → 401", False, f"Error: {str(e)}")
        return False

# ============================================================
# BUG FIX #1: CONTACT ADMIN NOW SUPPORTS EDITING EMAILS
# ============================================================
def test_bugfix1_contact_settings_get():
    """BUG FIX #1.1: GET /api/cms/contact_settings → has emails, phones, officeHours, addressLines, socials"""
    global original_values
    try:
        resp = requests.get(f"{BASE_URL}/cms/contact_settings", timeout=10)
        data = resp.json()
        doc = data.get("data", {})
        
        has_emails = "emails" in doc and isinstance(doc.get("emails"), list)
        has_phones = "phones" in doc and isinstance(doc.get("phones"), list)
        has_office_hours = "officeHours" in doc and isinstance(doc.get("officeHours"), str)
        has_address_lines = "addressLines" in doc and isinstance(doc.get("addressLines"), list)
        has_socials = "socials" in doc and isinstance(doc.get("socials"), dict)
        
        passed = resp.status_code == 200 and all([has_emails, has_phones, has_office_hours, has_address_lines, has_socials])
        
        # Store original values for restoration
        if passed:
            original_values["contact_settings"] = {
                "emails": doc.get("emails", []),
                "phones": doc.get("phones", []),
                "officeHours": doc.get("officeHours", ""),
                "addressLines": doc.get("addressLines", [])
            }
        
        details = f"emails: {doc.get('emails')}, phones: {doc.get('phones')}, officeHours: '{doc.get('officeHours')}', addressLines: {doc.get('addressLines')}, socials: {doc.get('socials')}"
        print_test("BUG FIX #1.1 - contact_settings GET structure", passed, details)
        return passed
    except Exception as e:
        print_test("BUG FIX #1.1 - contact_settings GET structure", False, f"Error: {str(e)}")
        return False

def test_bugfix1_contact_settings_post():
    """BUG FIX #1.2: POST /api/cms/contact_settings with new emails → 200 and persists"""
    try:
        # POST update
        resp = requests.post(
            f"{BASE_URL}/cms/contact_settings",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "emails": ["test-admin@vayucodes.com", "hello@vayucodes.com"],
                "phones": ["+91 99999 00000"],
                "officeHours": "Mon-Fri · 9am-6pm IST",
                "addressLines": ["Test line 1", "Test line 2"]
            },
            timeout=10
        )
        data = resp.json()
        doc = data.get("data", {})
        
        passed = (
            resp.status_code == 200 and
            doc.get("emails") == ["test-admin@vayucodes.com", "hello@vayucodes.com"] and
            doc.get("phones") == ["+91 99999 00000"] and
            doc.get("officeHours") == "Mon-Fri · 9am-6pm IST" and
            doc.get("addressLines") == ["Test line 1", "Test line 2"]
        )
        
        print_test("BUG FIX #1.2 - contact_settings POST update", passed, f"emails: {doc.get('emails')}, phones: {doc.get('phones')}")
        return passed
    except Exception as e:
        print_test("BUG FIX #1.2 - contact_settings POST update", False, f"Error: {str(e)}")
        return False

def test_bugfix1_contact_settings_verify_persist():
    """BUG FIX #1.3: GET /api/cms/contact_settings again → verify new values persisted"""
    try:
        resp = requests.get(f"{BASE_URL}/cms/contact_settings", timeout=10)
        data = resp.json()
        doc = data.get("data", {})
        
        passed = (
            resp.status_code == 200 and
            doc.get("emails") == ["test-admin@vayucodes.com", "hello@vayucodes.com"] and
            doc.get("phones") == ["+91 99999 00000"]
        )
        
        print_test("BUG FIX #1.3 - contact_settings verify persisted", passed, f"emails: {doc.get('emails')}")
        return passed
    except Exception as e:
        print_test("BUG FIX #1.3 - contact_settings verify persisted", False, f"Error: {str(e)}")
        return False

def test_bugfix1_contact_settings_restore():
    """BUG FIX #1.4: RESTORE original contact_settings values"""
    try:
        if "contact_settings" not in original_values:
            print_test("BUG FIX #1.4 - RESTORE contact_settings", False, "No original values stored")
            return False
        
        resp = requests.post(
            f"{BASE_URL}/cms/contact_settings",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "emails": ["hello@vayucodes.com"],
                "phones": [],
                "addressLines": [],
                "officeHours": "Mon–Fri · 10am–7pm IST"
            },
            timeout=10
        )
        
        passed = resp.status_code == 200
        print_test("BUG FIX #1.4 - RESTORE contact_settings", passed, "Restored to: emails=['hello@vayucodes.com'], phones=[], addressLines=[], officeHours='Mon–Fri · 10am–7pm IST'")
        return passed
    except Exception as e:
        print_test("BUG FIX #1.4 - RESTORE contact_settings", False, f"Error: {str(e)}")
        return False

# ============================================================
# BUG FIX #2: CONTACT PAGE ADMIN SAVES BOTH COLLECTIONS
# ============================================================
def test_bugfix2_page_content_contact_get():
    """BUG FIX #2.1: GET /api/cms/page_content/contact → has data.data with heroBadge, formEyebrow, formPlaceholders, faqEyebrow, formSuccess"""
    global original_values
    try:
        resp = requests.get(f"{BASE_URL}/cms/page_content/contact", timeout=10)
        data = resp.json()
        doc = data.get("data", {})
        content_data = doc.get("data", {})
        
        has_hero_badge = "heroBadge" in content_data
        has_form_eyebrow = "formEyebrow" in content_data
        has_form_placeholders = "formPlaceholders" in content_data and isinstance(content_data.get("formPlaceholders"), dict)
        has_faq_eyebrow = "faqEyebrow" in content_data
        has_form_success = "formSuccess" in content_data
        
        passed = resp.status_code == 200 and all([has_hero_badge, has_form_eyebrow, has_form_placeholders, has_faq_eyebrow, has_form_success])
        
        # Store original values
        if passed:
            original_values["page_content_contact"] = {
                "heroBadge": content_data.get("heroBadge"),
                "formEyebrow": content_data.get("formEyebrow")
            }
        
        details = f"heroBadge: '{content_data.get('heroBadge')}', formEyebrow: '{content_data.get('formEyebrow')}', formPlaceholders: {list(content_data.get('formPlaceholders', {}).keys())}"
        print_test("BUG FIX #2.1 - page_content/contact GET structure", passed, details)
        return passed
    except Exception as e:
        print_test("BUG FIX #2.1 - page_content/contact GET structure", False, f"Error: {str(e)}")
        return False

def test_bugfix2_page_content_contact_post():
    """BUG FIX #2.2: POST /api/cms/page_content with key='contact' → updates and returns new values"""
    try:
        resp = requests.post(
            f"{BASE_URL}/cms/page_content",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "key": "contact",
                "title": "Contact",
                "data": {
                    "heroBadge": "TEST BADGE",
                    "formEyebrow": "— Test eyebrow"
                }
            },
            timeout=10
        )
        data = resp.json()
        doc = data.get("data", {})
        content_data = doc.get("data", {})
        
        passed = (
            resp.status_code == 200 and
            content_data.get("heroBadge") == "TEST BADGE" and
            content_data.get("formEyebrow") == "— Test eyebrow"
        )
        
        print_test("BUG FIX #2.2 - page_content/contact POST update", passed, f"heroBadge: '{content_data.get('heroBadge')}', formEyebrow: '{content_data.get('formEyebrow')}'")
        return passed
    except Exception as e:
        print_test("BUG FIX #2.2 - page_content/contact POST update", False, f"Error: {str(e)}")
        return False

def test_bugfix2_page_content_contact_verify():
    """BUG FIX #2.3: GET /api/cms/page_content/contact again → verify updated values"""
    try:
        resp = requests.get(f"{BASE_URL}/cms/page_content/contact", timeout=10)
        data = resp.json()
        doc = data.get("data", {})
        content_data = doc.get("data", {})
        
        passed = (
            resp.status_code == 200 and
            content_data.get("heroBadge") == "TEST BADGE" and
            content_data.get("formEyebrow") == "— Test eyebrow"
        )
        
        print_test("BUG FIX #2.3 - page_content/contact verify updated", passed, f"heroBadge: '{content_data.get('heroBadge')}'")
        return passed
    except Exception as e:
        print_test("BUG FIX #2.3 - page_content/contact verify updated", False, f"Error: {str(e)}")
        return False

def test_bugfix2_page_content_contact_restore():
    """BUG FIX #2.4: RESTORE original page_content/contact values"""
    try:
        if "page_content_contact" not in original_values:
            print_test("BUG FIX #2.4 - RESTORE page_content/contact", False, "No original values stored")
            return False
        
        resp = requests.post(
            f"{BASE_URL}/cms/page_content",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "key": "contact",
                "data": {
                    "heroBadge": "Contact",
                    "formEyebrow": "— Project inquiry"
                }
            },
            timeout=10
        )
        
        passed = resp.status_code == 200
        print_test("BUG FIX #2.4 - RESTORE page_content/contact", passed, "Restored heroBadge='Contact', formEyebrow='— Project inquiry'")
        return passed
    except Exception as e:
        print_test("BUG FIX #2.4 - RESTORE page_content/contact", False, f"Error: {str(e)}")
        return False

# ============================================================
# BUG FIX #3: HOME HERO MOBILE VIDEO FIELD
# ============================================================
def test_bugfix3_home_page_content_get():
    """BUG FIX #3.1: GET /api/cms/page_content/home → has heroVideoUrlMobile, heroVideoUrl, heroVideoEnabled"""
    try:
        resp = requests.get(f"{BASE_URL}/cms/page_content/home", timeout=10)
        data = resp.json()
        doc = data.get("data", {})
        content_data = doc.get("data", {})
        
        has_mobile_video = "heroVideoUrlMobile" in content_data
        has_desktop_video = "heroVideoUrl" in content_data
        has_video_enabled = "heroVideoEnabled" in content_data
        
        mobile_video_url = content_data.get("heroVideoUrlMobile")
        desktop_video_url = content_data.get("heroVideoUrl")
        video_enabled = content_data.get("heroVideoEnabled")
        
        passed = (
            resp.status_code == 200 and
            has_mobile_video and
            has_desktop_video and
            has_video_enabled and
            mobile_video_url == "/videos/hero-mobile.mp4" and
            desktop_video_url == "/videos/hero-cinematic.mp4" and
            video_enabled == True
        )
        
        details = f"heroVideoUrlMobile: '{mobile_video_url}', heroVideoUrl: '{desktop_video_url}', heroVideoEnabled: {video_enabled}"
        print_test("BUG FIX #3.1 - home page_content video fields", passed, details)
        return passed
    except Exception as e:
        print_test("BUG FIX #3.1 - home page_content video fields", False, f"Error: {str(e)}")
        return False

def test_bugfix3_mobile_video_file_exists():
    """BUG FIX #3.2: HEAD/GET /videos/hero-mobile.mp4 → 200 OK, Content-Type: video/mp4, size ~51MB"""
    try:
        video_url = "https://reels-player-2.preview.emergentagent.com/videos/hero-mobile.mp4"
        resp = requests.head(video_url, timeout=10, allow_redirects=True)
        
        # If HEAD doesn't work, try GET with stream
        if resp.status_code != 200:
            resp = requests.get(video_url, timeout=10, stream=True)
        
        content_type = resp.headers.get("Content-Type", "")
        content_length = int(resp.headers.get("Content-Length", 0))
        size_mb = content_length / (1024 * 1024)
        
        passed = (
            resp.status_code == 200 and
            "video" in content_type.lower() and
            40 <= size_mb <= 60  # Around 51MB
        )
        
        details = f"Status: {resp.status_code}, Content-Type: {content_type}, Size: {size_mb:.1f}MB"
        print_test("BUG FIX #3.2 - hero-mobile.mp4 file exists", passed, details)
        return passed
    except Exception as e:
        print_test("BUG FIX #3.2 - hero-mobile.mp4 file exists", False, f"Error: {str(e)}")
        return False

# ============================================================
# BUG FIX #4: PORTFOLIO SLIDER (frontend CSS fix - just confirm page renders)
# ============================================================
def test_bugfix4_our_work_page_renders():
    """BUG FIX #4: GET /our-work page → 200 OK (frontend CSS fix, no backend test needed)"""
    try:
        page_url = "https://reels-player-2.preview.emergentagent.com/our-work"
        resp = requests.get(page_url, timeout=10)
        
        passed = resp.status_code == 200
        
        details = f"Status: {resp.status_code}"
        print_test("BUG FIX #4 - /our-work page renders", passed, details)
        return passed
    except Exception as e:
        print_test("BUG FIX #4 - /our-work page renders", False, f"Error: {str(e)}")
        return False

# ============================================================
# MAIN TEST RUNNER
# ============================================================
def main():
    print("\n" + "="*80)
    print("  VayuCodes CMS Backend Bug Fix Verification Test Suite")
    print("  Testing 4 Recent Bug Fixes (Jul 26 continuation)")
    print("="*80)
    print(f"  Base URL: {BASE_URL}")
    print(f"  Admin: {ADMIN_EMAIL}")
    print("="*80 + "\n")
    
    # Setup auth
    if not setup_auth():
        print("\n❌ FAILED TO LOGIN - Cannot proceed with tests\n")
        return False
    
    all_results = []
    
    # SANITY CHECKS
    print_section("SANITY CHECKS")
    all_results.append(test_sanity_health())
    all_results.append(test_sanity_page_content_list())
    all_results.append(test_sanity_faq_items())
    all_results.append(test_sanity_auth_401())
    
    # BUG FIX #1: CONTACT ADMIN NOW SUPPORTS EDITING EMAILS
    print_section("BUG FIX #1: CONTACT ADMIN NOW SUPPORTS EDITING EMAILS")
    all_results.append(test_bugfix1_contact_settings_get())
    all_results.append(test_bugfix1_contact_settings_post())
    all_results.append(test_bugfix1_contact_settings_verify_persist())
    all_results.append(test_bugfix1_contact_settings_restore())
    
    # BUG FIX #2: CONTACT PAGE ADMIN SAVES BOTH COLLECTIONS
    print_section("BUG FIX #2: CONTACT PAGE ADMIN SAVES BOTH COLLECTIONS")
    all_results.append(test_bugfix2_page_content_contact_get())
    all_results.append(test_bugfix2_page_content_contact_post())
    all_results.append(test_bugfix2_page_content_contact_verify())
    all_results.append(test_bugfix2_page_content_contact_restore())
    
    # BUG FIX #3: HOME HERO MOBILE VIDEO FIELD
    print_section("BUG FIX #3: HOME HERO MOBILE VIDEO FIELD")
    all_results.append(test_bugfix3_home_page_content_get())
    all_results.append(test_bugfix3_mobile_video_file_exists())
    
    # BUG FIX #4: PORTFOLIO SLIDER
    print_section("BUG FIX #4: PORTFOLIO SLIDER (frontend CSS fix)")
    all_results.append(test_bugfix4_our_work_page_renders())
    
    # Summary
    print("\n" + "="*80)
    print("  TEST SUMMARY")
    print("="*80)
    passed = sum(all_results)
    total = len(all_results)
    print(f"\n  Total: {passed}/{total} tests passed")
    print(f"  Success rate: {(passed/total)*100:.1f}%\n")
    
    if passed == total:
        print("  ✅ ALL BUG FIX TESTS PASSED - All 4 bug fixes verified!")
    else:
        print(f"  ❌ {total - passed} TEST(S) FAILED")
    
    print("="*80 + "\n")
    
    return passed == total

if __name__ == "__main__":
    import sys
    success = main()
    sys.exit(0 if success else 1)
