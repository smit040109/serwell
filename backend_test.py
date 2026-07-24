#!/usr/bin/env python3
"""
VayuCodes CMS Backend API Test Suite - Phase 1-4 Complete
Tests all endpoints including new Phase 1-3 collections and Phase 4 media endpoints
"""

import requests
import json
import io
import time
from PIL import Image

# Use production URL from .env
BASE_URL = "https://vayucms-phase4.preview.emergentagent.com/api"
ADMIN_EMAIL = "admin@vayucodes.com"
ADMIN_PASSWORD = "VayuAdmin@2026"

# Global token storage
auth_token = None
test_ids = {}
original_values = {}

def print_test(name, passed, details=""):
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status} | {name}")
    if details:
        print(f"    {details}")
    print()

def print_section(title):
    print("\n" + "="*70)
    print(f"  {title}")
    print("="*70 + "\n")

# ============================================================
# 1. HEALTH CHECK
# ============================================================
def test_health():
    """Test 1: GET /api/health"""
    try:
        resp = requests.get(f"{BASE_URL}/health", timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            data.get("status") == "ok" and
            data.get("app") == "vayucodes-cms"
        )
        print_test("Health Check", passed, f"Response: {data}")
        return passed
    except Exception as e:
        print_test("Health Check", False, f"Error: {str(e)}")
        return False

# ============================================================
# 2. AUTH FLOW
# ============================================================
def test_auth_wrong_password():
    """Test 2.1: Login with wrong password → 401"""
    try:
        resp = requests.post(
            f"{BASE_URL}/admin/login",
            json={"email": ADMIN_EMAIL, "password": "WrongPassword123"},
            timeout=10
        )
        passed = resp.status_code == 401
        print_test("Auth - Wrong Password → 401", passed, f"Status: {resp.status_code}")
        return passed
    except Exception as e:
        print_test("Auth - Wrong Password → 401", False, f"Error: {str(e)}")
        return False

def test_auth_login_success():
    """Test 2.2: Login success → JWT token"""
    global auth_token
    try:
        resp = requests.post(
            f"{BASE_URL}/admin/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
            timeout=10
        )
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            "token" in data and
            "admin" in data
        )
        if passed:
            auth_token = data["token"]
        print_test("Auth - Login Success → JWT", passed, f"Token received: {bool(auth_token)}")
        return passed
    except Exception as e:
        print_test("Auth - Login Success → JWT", False, f"Error: {str(e)}")
        return False

def test_auth_me_no_token():
    """Test 2.3: GET /admin/me without token → 401"""
    try:
        resp = requests.get(f"{BASE_URL}/admin/me", timeout=10)
        passed = resp.status_code == 401
        print_test("Auth - /admin/me without token → 401", passed, f"Status: {resp.status_code}")
        return passed
    except Exception as e:
        print_test("Auth - /admin/me without token → 401", False, f"Error: {str(e)}")
        return False

def test_auth_me_with_token():
    """Test 2.4: GET /admin/me with token → 200"""
    try:
        resp = requests.get(
            f"{BASE_URL}/admin/me",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        data = resp.json()
        passed = resp.status_code == 200 and "admin" in data
        print_test("Auth - /admin/me with token → 200", passed, f"Admin: {data.get('admin', {}).get('email')}")
        return passed
    except Exception as e:
        print_test("Auth - /admin/me with token → 200", False, f"Error: {str(e)}")
        return False

# ============================================================
# 3. REGRESSION - EXISTING 13 COLLECTIONS
# ============================================================
def test_regression_public_collections():
    """Test 3: Public GET for all 13 collections"""
    results = []
    
    # List collections (should return arrays)
    list_collections = [
        ("team_members", 2),  # 2 co-founders
        ("portfolio_projects", 5),
        ("services", 6),
        ("testimonials", 3),
        ("pages", 5),
        ("media", None),  # variable count
        ("sections", None),
    ]
    
    for collection, expected_count in list_collections:
        try:
            resp = requests.get(f"{BASE_URL}/cms/{collection}", timeout=10)
            data = resp.json()
            items = data.get("data", [])
            passed = resp.status_code == 200 and isinstance(items, list)
            if expected_count is not None:
                passed = passed and len(items) >= expected_count
            details = f"Found {len(items)} items"
            if expected_count:
                details += f" (expected >= {expected_count})"
            print_test(f"Regression - GET /cms/{collection}", passed, details)
            results.append(passed)
        except Exception as e:
            print_test(f"Regression - GET /cms/{collection}", False, f"Error: {str(e)}")
            results.append(False)
    
    # Singleton collections (should return single object with _id='main')
    singleton_collections = [
        "site_settings",
        "contact_settings",
        "navigation",
        "footer",
        "seo_settings",
    ]
    
    for collection in singleton_collections:
        try:
            resp = requests.get(f"{BASE_URL}/cms/{collection}", timeout=10)
            data = resp.json()
            doc = data.get("data", {})
            passed = (
                resp.status_code == 200 and
                isinstance(doc, dict) and
                doc.get("_id") == "main"
            )
            print_test(f"Regression - GET /cms/{collection} (singleton)", passed, f"_id: {doc.get('_id')}")
            results.append(passed)
        except Exception as e:
            print_test(f"Regression - GET /cms/{collection} (singleton)", False, f"Error: {str(e)}")
            results.append(False)
    
    return all(results)

def test_regression_portfolio_crud():
    """Test 3.1: Portfolio CRUD spot-check"""
    global test_ids
    results = []
    
    # CREATE
    try:
        resp = requests.post(
            f"{BASE_URL}/cms/portfolio_projects",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "title": "Test Project CRUD",
                "slug": f"test-project-{int(time.time())}",
                "category": "Test",
                "published": True
            },
            timeout=10
        )
        data = resp.json()
        passed = resp.status_code == 200 and "_id" in data.get("data", {})
        if passed:
            test_ids["portfolio_crud"] = data["data"]["_id"]
        print_test("Regression - Portfolio CREATE", passed, f"ID: {test_ids.get('portfolio_crud')}")
        results.append(passed)
    except Exception as e:
        print_test("Regression - Portfolio CREATE", False, f"Error: {str(e)}")
        results.append(False)
    
    # GET by ID
    try:
        pid = test_ids.get("portfolio_crud")
        if pid:
            resp = requests.get(f"{BASE_URL}/cms/portfolio_projects/{pid}", timeout=10)
            data = resp.json()
            passed = resp.status_code == 200 and data.get("data", {}).get("_id") == pid
            print_test("Regression - Portfolio GET by ID", passed, f"Title: {data.get('data', {}).get('title')}")
            results.append(passed)
        else:
            print_test("Regression - Portfolio GET by ID", False, "No ID")
            results.append(False)
    except Exception as e:
        print_test("Regression - Portfolio GET by ID", False, f"Error: {str(e)}")
        results.append(False)
    
    # UPDATE
    try:
        pid = test_ids.get("portfolio_crud")
        if pid:
            resp = requests.put(
                f"{BASE_URL}/cms/portfolio_projects/{pid}",
                headers={"Authorization": f"Bearer {auth_token}"},
                json={"title": "Test Project UPDATED"},
                timeout=10
            )
            data = resp.json()
            passed = resp.status_code == 200 and data.get("data", {}).get("title") == "Test Project UPDATED"
            print_test("Regression - Portfolio UPDATE", passed, f"New title: {data.get('data', {}).get('title')}")
            results.append(passed)
        else:
            print_test("Regression - Portfolio UPDATE", False, "No ID")
            results.append(False)
    except Exception as e:
        print_test("Regression - Portfolio UPDATE", False, f"Error: {str(e)}")
        results.append(False)
    
    # DELETE
    try:
        pid = test_ids.get("portfolio_crud")
        if pid:
            resp = requests.delete(
                f"{BASE_URL}/cms/portfolio_projects/{pid}",
                headers={"Authorization": f"Bearer {auth_token}"},
                timeout=10
            )
            passed = resp.status_code == 200 and resp.json().get("ok") == True
            print_test("Regression - Portfolio DELETE", passed, f"Deleted: {passed}")
            results.append(passed)
        else:
            print_test("Regression - Portfolio DELETE", False, "No ID")
            results.append(False)
    except Exception as e:
        print_test("Regression - Portfolio DELETE", False, f"Error: {str(e)}")
        results.append(False)
    
    # Verify 404 after delete
    try:
        pid = test_ids.get("portfolio_crud")
        if pid:
            resp = requests.get(f"{BASE_URL}/cms/portfolio_projects/{pid}", timeout=10)
            passed = resp.status_code == 404
            print_test("Regression - Portfolio GET after DELETE → 404", passed, f"Status: {resp.status_code}")
            results.append(passed)
        else:
            print_test("Regression - Portfolio GET after DELETE → 404", False, "No ID")
            results.append(False)
    except Exception as e:
        print_test("Regression - Portfolio GET after DELETE → 404", False, f"Error: {str(e)}")
        results.append(False)
    
    return all(results)

# ============================================================
# 4. PHASE 1-3: SITE SETTINGS EXTENDED FIELDS
# ============================================================
def test_site_settings_extended_fields():
    """Test 4: SiteSettings extended fields (Phase 1-3)"""
    global original_values
    results = []
    
    # GET and verify all extended fields exist
    try:
        resp = requests.get(f"{BASE_URL}/cms/site_settings", timeout=10)
        data = resp.json()
        doc = data.get("data", {})
        
        required_fields = [
            "rotatingWords",
            "closingStatement",
            "preloaderText",
            "cinematicVideoUrl",
            "cinematicPosterUrl",
            "cinematicEnabled",
            "introTypewriterText"
        ]
        
        all_present = all(field in doc for field in required_fields)
        rotating_words_valid = isinstance(doc.get("rotatingWords"), list) and len(doc.get("rotatingWords", [])) == 4
        
        passed = resp.status_code == 200 and all_present and rotating_words_valid
        
        # Store original values for restoration
        if passed:
            original_values["site_settings"] = {
                "preloaderText": doc.get("preloaderText"),
                "rotatingWords": doc.get("rotatingWords"),
            }
        
        details = f"Fields present: {all_present}, rotatingWords: {doc.get('rotatingWords')}, preloaderText: '{doc.get('preloaderText')}', cinematicVideoUrl: '{doc.get('cinematicVideoUrl')}'"
        print_test("Phase 1-3 - SiteSettings extended fields GET", passed, details)
        results.append(passed)
    except Exception as e:
        print_test("Phase 1-3 - SiteSettings extended fields GET", False, f"Error: {str(e)}")
        results.append(False)
    
    # POST update with auth
    try:
        resp = requests.post(
            f"{BASE_URL}/cms/site_settings",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "preloaderText": "TEST PRELOADER",
                "rotatingWords": ["test-a", "test-b"]
            },
            timeout=10
        )
        data = resp.json()
        doc = data.get("data", {})
        passed = (
            resp.status_code == 200 and
            doc.get("preloaderText") == "TEST PRELOADER" and
            doc.get("rotatingWords") == ["test-a", "test-b"]
        )
        print_test("Phase 1-3 - SiteSettings POST update (auth)", passed, f"preloaderText: '{doc.get('preloaderText')}'")
        results.append(passed)
    except Exception as e:
        print_test("Phase 1-3 - SiteSettings POST update (auth)", False, f"Error: {str(e)}")
        results.append(False)
    
    # Verify persisted
    try:
        resp = requests.get(f"{BASE_URL}/cms/site_settings", timeout=10)
        data = resp.json()
        doc = data.get("data", {})
        passed = (
            resp.status_code == 200 and
            doc.get("preloaderText") == "TEST PRELOADER"
        )
        print_test("Phase 1-3 - SiteSettings verify persisted", passed, f"preloaderText: '{doc.get('preloaderText')}'")
        results.append(passed)
    except Exception as e:
        print_test("Phase 1-3 - SiteSettings verify persisted", False, f"Error: {str(e)}")
        results.append(False)
    
    # RESTORE original values
    try:
        if "site_settings" in original_values:
            resp = requests.post(
                f"{BASE_URL}/cms/site_settings",
                headers={"Authorization": f"Bearer {auth_token}"},
                json=original_values["site_settings"],
                timeout=10
            )
            passed = resp.status_code == 200
            print_test("Phase 1-3 - SiteSettings RESTORE original", passed, "Restored original values")
            results.append(passed)
        else:
            print_test("Phase 1-3 - SiteSettings RESTORE original", False, "No original values stored")
            results.append(False)
    except Exception as e:
        print_test("Phase 1-3 - SiteSettings RESTORE original", False, f"Error: {str(e)}")
        results.append(False)
    
    return all(results)

# ============================================================
# 5. PHASE 1-3: HOW_WE_WORK_STEPS COLLECTION
# ============================================================
def test_how_we_work_steps():
    """Test 5: how_we_work_steps collection (Phase 1-3)"""
    global test_ids
    results = []
    
    # GET list (should have 5 published steps)
    try:
        resp = requests.get(f"{BASE_URL}/cms/how_we_work_steps", timeout=10)
        data = resp.json()
        steps = data.get("data", [])
        passed = resp.status_code == 200 and len(steps) >= 5
        print_test("Phase 1-3 - how_we_work_steps GET list", passed, f"Found {len(steps)} steps (expected >= 5)")
        results.append(passed)
    except Exception as e:
        print_test("Phase 1-3 - how_we_work_steps GET list", False, f"Error: {str(e)}")
        results.append(False)
    
    # POST without token → 401
    try:
        resp = requests.post(
            f"{BASE_URL}/cms/how_we_work_steps",
            json={"title": "Test Step", "stepNumber": 99},
            timeout=10
        )
        passed = resp.status_code == 401
        print_test("Phase 1-3 - how_we_work_steps POST without token → 401", passed, f"Status: {resp.status_code}")
        results.append(passed)
    except Exception as e:
        print_test("Phase 1-3 - how_we_work_steps POST without token → 401", False, f"Error: {str(e)}")
        results.append(False)
    
    # CREATE with auth
    try:
        resp = requests.post(
            f"{BASE_URL}/cms/how_we_work_steps",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "stepNumber": 6,
                "title": "Test Step",
                "description": "Test description",
                "order": 6,
                "published": True
            },
            timeout=10
        )
        data = resp.json()
        passed = resp.status_code == 200 and "_id" in data.get("data", {})
        if passed:
            test_ids["how_we_work_step"] = data["data"]["_id"]
        print_test("Phase 1-3 - how_we_work_steps CREATE", passed, f"ID: {test_ids.get('how_we_work_step')}")
        results.append(passed)
    except Exception as e:
        print_test("Phase 1-3 - how_we_work_steps CREATE", False, f"Error: {str(e)}")
        results.append(False)
    
    # GET by ID
    try:
        sid = test_ids.get("how_we_work_step")
        if sid:
            resp = requests.get(f"{BASE_URL}/cms/how_we_work_steps/{sid}", timeout=10)
            data = resp.json()
            passed = resp.status_code == 200 and data.get("data", {}).get("_id") == sid
            print_test("Phase 1-3 - how_we_work_steps GET by ID", passed, f"Title: {data.get('data', {}).get('title')}")
            results.append(passed)
        else:
            print_test("Phase 1-3 - how_we_work_steps GET by ID", False, "No ID")
            results.append(False)
    except Exception as e:
        print_test("Phase 1-3 - how_we_work_steps GET by ID", False, f"Error: {str(e)}")
        results.append(False)
    
    # UPDATE
    try:
        sid = test_ids.get("how_we_work_step")
        if sid:
            resp = requests.put(
                f"{BASE_URL}/cms/how_we_work_steps/{sid}",
                headers={"Authorization": f"Bearer {auth_token}"},
                json={"title": "Test Step UPDATED"},
                timeout=10
            )
            data = resp.json()
            passed = resp.status_code == 200 and data.get("data", {}).get("title") == "Test Step UPDATED"
            print_test("Phase 1-3 - how_we_work_steps UPDATE", passed, f"New title: {data.get('data', {}).get('title')}")
            results.append(passed)
        else:
            print_test("Phase 1-3 - how_we_work_steps UPDATE", False, "No ID")
            results.append(False)
    except Exception as e:
        print_test("Phase 1-3 - how_we_work_steps UPDATE", False, f"Error: {str(e)}")
        results.append(False)
    
    # DELETE
    try:
        sid = test_ids.get("how_we_work_step")
        if sid:
            resp = requests.delete(
                f"{BASE_URL}/cms/how_we_work_steps/{sid}",
                headers={"Authorization": f"Bearer {auth_token}"},
                timeout=10
            )
            passed = resp.status_code == 200 and resp.json().get("ok") == True
            print_test("Phase 1-3 - how_we_work_steps DELETE", passed, f"Deleted: {passed}")
            results.append(passed)
        else:
            print_test("Phase 1-3 - how_we_work_steps DELETE", False, "No ID")
            results.append(False)
    except Exception as e:
        print_test("Phase 1-3 - how_we_work_steps DELETE", False, f"Error: {str(e)}")
        results.append(False)
    
    # Verify gone
    try:
        sid = test_ids.get("how_we_work_step")
        if sid:
            resp = requests.get(f"{BASE_URL}/cms/how_we_work_steps/{sid}", timeout=10)
            passed = resp.status_code == 404
            print_test("Phase 1-3 - how_we_work_steps verify gone → 404", passed, f"Status: {resp.status_code}")
            results.append(passed)
        else:
            print_test("Phase 1-3 - how_we_work_steps verify gone → 404", False, "No ID")
            results.append(False)
    except Exception as e:
        print_test("Phase 1-3 - how_we_work_steps verify gone → 404", False, f"Error: {str(e)}")
        results.append(False)
    
    return all(results)

# ============================================================
# 6. PHASE 1-3: FAQ_ITEMS COLLECTION
# ============================================================
def test_faq_items():
    """Test 6: faq_items collection (Phase 1-3)"""
    global test_ids
    results = []
    
    # GET list (should have 4 items)
    try:
        resp = requests.get(f"{BASE_URL}/cms/faq_items", timeout=10)
        data = resp.json()
        items = data.get("data", [])
        passed = resp.status_code == 200 and len(items) >= 4
        print_test("Phase 1-3 - faq_items GET list", passed, f"Found {len(items)} items (expected >= 4)")
        results.append(passed)
    except Exception as e:
        print_test("Phase 1-3 - faq_items GET list", False, f"Error: {str(e)}")
        results.append(False)
    
    # POST without token → 401
    try:
        resp = requests.post(
            f"{BASE_URL}/cms/faq_items",
            json={"question": "Test?", "answer": "Test answer"},
            timeout=10
        )
        passed = resp.status_code == 401
        print_test("Phase 1-3 - faq_items POST without token → 401", passed, f"Status: {resp.status_code}")
        results.append(passed)
    except Exception as e:
        print_test("Phase 1-3 - faq_items POST without token → 401", False, f"Error: {str(e)}")
        results.append(False)
    
    # CREATE with auth
    try:
        resp = requests.post(
            f"{BASE_URL}/cms/faq_items",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "question": "Test Question?",
                "answer": "Test answer for backend testing",
                "category": "test",
                "published": True
            },
            timeout=10
        )
        data = resp.json()
        passed = resp.status_code == 200 and "_id" in data.get("data", {})
        if passed:
            test_ids["faq_item"] = data["data"]["_id"]
        print_test("Phase 1-3 - faq_items CREATE", passed, f"ID: {test_ids.get('faq_item')}")
        results.append(passed)
    except Exception as e:
        print_test("Phase 1-3 - faq_items CREATE", False, f"Error: {str(e)}")
        results.append(False)
    
    # UPDATE
    try:
        fid = test_ids.get("faq_item")
        if fid:
            resp = requests.put(
                f"{BASE_URL}/cms/faq_items/{fid}",
                headers={"Authorization": f"Bearer {auth_token}"},
                json={"answer": "Updated answer"},
                timeout=10
            )
            data = resp.json()
            passed = resp.status_code == 200 and data.get("data", {}).get("answer") == "Updated answer"
            print_test("Phase 1-3 - faq_items UPDATE", passed, f"New answer: {data.get('data', {}).get('answer')}")
            results.append(passed)
        else:
            print_test("Phase 1-3 - faq_items UPDATE", False, "No ID")
            results.append(False)
    except Exception as e:
        print_test("Phase 1-3 - faq_items UPDATE", False, f"Error: {str(e)}")
        results.append(False)
    
    # DELETE
    try:
        fid = test_ids.get("faq_item")
        if fid:
            resp = requests.delete(
                f"{BASE_URL}/cms/faq_items/{fid}",
                headers={"Authorization": f"Bearer {auth_token}"},
                timeout=10
            )
            passed = resp.status_code == 200 and resp.json().get("ok") == True
            print_test("Phase 1-3 - faq_items DELETE", passed, f"Deleted: {passed}")
            results.append(passed)
        else:
            print_test("Phase 1-3 - faq_items DELETE", False, "No ID")
            results.append(False)
    except Exception as e:
        print_test("Phase 1-3 - faq_items DELETE", False, f"Error: {str(e)}")
        results.append(False)
    
    return all(results)

# ============================================================
# 7. PHASE 1-3: LEGAL_PAGES KEYED_UPSERT
# ============================================================
def test_legal_pages_keyed_upsert():
    """Test 7: legal_pages KEYED_UPSERT (Phase 1-3)"""
    global test_ids, original_values
    results = []
    
    # GET list (should have 2: privacy, terms)
    try:
        resp = requests.get(f"{BASE_URL}/cms/legal_pages", timeout=10)
        data = resp.json()
        pages = data.get("data", [])
        passed = resp.status_code == 200 and len(pages) >= 2
        keys = [p.get("key") for p in pages]
        print_test("Phase 1-3 - legal_pages GET list", passed, f"Found {len(pages)} pages, keys: {keys}")
        results.append(passed)
    except Exception as e:
        print_test("Phase 1-3 - legal_pages GET list", False, f"Error: {str(e)}")
        results.append(False)
    
    # GET by key (privacy)
    try:
        resp = requests.get(f"{BASE_URL}/cms/legal_pages/privacy", timeout=10)
        data = resp.json()
        doc = data.get("data", {})
        passed = (
            resp.status_code == 200 and
            doc.get("key") == "privacy" and
            "title" in doc and
            "sections" in doc
        )
        # Store original for restoration
        if passed:
            original_values["legal_privacy_title"] = doc.get("title")
        print_test("Phase 1-3 - legal_pages GET by key (privacy)", passed, f"Title: '{doc.get('title')}'")
        results.append(passed)
    except Exception as e:
        print_test("Phase 1-3 - legal_pages GET by key (privacy)", False, f"Error: {str(e)}")
        results.append(False)
    
    # KEYED UPSERT - update existing privacy (should NOT create duplicate)
    try:
        # Get count before
        resp_before = requests.get(f"{BASE_URL}/cms/legal_pages", timeout=10)
        count_before = len(resp_before.json().get("data", []))
        
        # Upsert
        resp = requests.post(
            f"{BASE_URL}/cms/legal_pages",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "key": "privacy",
                "title": "Privacy Policy UPDATED"
            },
            timeout=10
        )
        data = resp.json()
        
        # Get count after
        resp_after = requests.get(f"{BASE_URL}/cms/legal_pages", timeout=10)
        count_after = len(resp_after.json().get("data", []))
        
        passed = (
            resp.status_code == 200 and
            data.get("data", {}).get("title") == "Privacy Policy UPDATED" and
            count_before == count_after  # No duplicate created
        )
        print_test("Phase 1-3 - legal_pages KEYED UPSERT (no duplicate)", passed, f"Count before: {count_before}, after: {count_after}")
        results.append(passed)
    except Exception as e:
        print_test("Phase 1-3 - legal_pages KEYED UPSERT (no duplicate)", False, f"Error: {str(e)}")
        results.append(False)
    
    # Verify updated
    try:
        resp = requests.get(f"{BASE_URL}/cms/legal_pages/privacy", timeout=10)
        data = resp.json()
        doc = data.get("data", {})
        passed = resp.status_code == 200 and doc.get("title") == "Privacy Policy UPDATED"
        print_test("Phase 1-3 - legal_pages verify updated", passed, f"Title: '{doc.get('title')}'")
        results.append(passed)
    except Exception as e:
        print_test("Phase 1-3 - legal_pages verify updated", False, f"Error: {str(e)}")
        results.append(False)
    
    # RESTORE original title
    try:
        if "legal_privacy_title" in original_values:
            resp = requests.post(
                f"{BASE_URL}/cms/legal_pages",
                headers={"Authorization": f"Bearer {auth_token}"},
                json={
                    "key": "privacy",
                    "title": original_values["legal_privacy_title"]
                },
                timeout=10
            )
            passed = resp.status_code == 200
            print_test("Phase 1-3 - legal_pages RESTORE original", passed, f"Restored title: '{original_values['legal_privacy_title']}'")
            results.append(passed)
        else:
            print_test("Phase 1-3 - legal_pages RESTORE original", False, "No original title stored")
            results.append(False)
    except Exception as e:
        print_test("Phase 1-3 - legal_pages RESTORE original", False, f"Error: {str(e)}")
        results.append(False)
    
    # CREATE new key (test-legal)
    try:
        resp = requests.post(
            f"{BASE_URL}/cms/legal_pages",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "key": "test-legal",
                "title": "Test Legal Page",
                "sections": [{"heading": "Test", "body": "Test body"}]
            },
            timeout=10
        )
        data = resp.json()
        passed = resp.status_code == 200 and "_id" in data.get("data", {})
        if passed:
            test_ids["legal_page"] = data["data"]["_id"]
        print_test("Phase 1-3 - legal_pages CREATE new key", passed, f"ID: {test_ids.get('legal_page')}")
        results.append(passed)
    except Exception as e:
        print_test("Phase 1-3 - legal_pages CREATE new key", False, f"Error: {str(e)}")
        results.append(False)
    
    # DELETE new key
    try:
        lid = test_ids.get("legal_page")
        if lid:
            resp = requests.delete(
                f"{BASE_URL}/cms/legal_pages/{lid}",
                headers={"Authorization": f"Bearer {auth_token}"},
                timeout=10
            )
            passed = resp.status_code == 200 and resp.json().get("ok") == True
            print_test("Phase 1-3 - legal_pages DELETE new key", passed, f"Deleted: {passed}")
            results.append(passed)
        else:
            print_test("Phase 1-3 - legal_pages DELETE new key", False, "No ID")
            results.append(False)
    except Exception as e:
        print_test("Phase 1-3 - legal_pages DELETE new key", False, f"Error: {str(e)}")
        results.append(False)
    
    return all(results)

# ============================================================
# 8. PHASE 1-3: PAGE_CONTENT KEYED_UPSERT
# ============================================================
def test_page_content_keyed_upsert():
    """Test 8: page_content KEYED_UPSERT (Phase 1-3)"""
    global original_values
    results = []
    
    # GET list (should have 2: why-us, digital-marketing)
    try:
        resp = requests.get(f"{BASE_URL}/cms/page_content", timeout=10)
        data = resp.json()
        pages = data.get("data", [])
        passed = resp.status_code == 200 and len(pages) >= 2
        keys = [p.get("key") for p in pages]
        print_test("Phase 1-3 - page_content GET list", passed, f"Found {len(pages)} pages, keys: {keys}")
        results.append(passed)
    except Exception as e:
        print_test("Phase 1-3 - page_content GET list", False, f"Error: {str(e)}")
        results.append(False)
    
    # GET by key (why-us)
    try:
        resp = requests.get(f"{BASE_URL}/cms/page_content/why-us", timeout=10)
        data = resp.json()
        doc = data.get("data", {})
        passed = (
            resp.status_code == 200 and
            doc.get("key") == "why-us" and
            "data" in doc
        )
        # Store original for restoration
        if passed and isinstance(doc.get("data"), dict):
            original_values["page_content_why_us_headline"] = doc.get("data", {}).get("headline")
        print_test("Phase 1-3 - page_content GET by key (why-us)", passed, f"Headline: '{doc.get('data', {}).get('headline')}'")
        results.append(passed)
    except Exception as e:
        print_test("Phase 1-3 - page_content GET by key (why-us)", False, f"Error: {str(e)}")
        results.append(False)
    
    # KEYED UPSERT - update why-us (should NOT create duplicate)
    try:
        # Get count before
        resp_before = requests.get(f"{BASE_URL}/cms/page_content", timeout=10)
        count_before = len(resp_before.json().get("data", []))
        
        # Upsert
        resp = requests.post(
            f"{BASE_URL}/cms/page_content",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "key": "why-us",
                "data": {"headline": "TEST HEADLINE UPDATED"}
            },
            timeout=10
        )
        data = resp.json()
        
        # Get count after
        resp_after = requests.get(f"{BASE_URL}/cms/page_content", timeout=10)
        count_after = len(resp_after.json().get("data", []))
        
        passed = (
            resp.status_code == 200 and
            data.get("data", {}).get("data", {}).get("headline") == "TEST HEADLINE UPDATED" and
            count_before == count_after  # No duplicate created
        )
        print_test("Phase 1-3 - page_content KEYED UPSERT (no duplicate)", passed, f"Count before: {count_before}, after: {count_after}")
        results.append(passed)
    except Exception as e:
        print_test("Phase 1-3 - page_content KEYED UPSERT (no duplicate)", False, f"Error: {str(e)}")
        results.append(False)
    
    # Verify updated
    try:
        resp = requests.get(f"{BASE_URL}/cms/page_content/why-us", timeout=10)
        data = resp.json()
        doc = data.get("data", {})
        passed = resp.status_code == 200 and doc.get("data", {}).get("headline") == "TEST HEADLINE UPDATED"
        print_test("Phase 1-3 - page_content verify updated", passed, f"Headline: '{doc.get('data', {}).get('headline')}'")
        results.append(passed)
    except Exception as e:
        print_test("Phase 1-3 - page_content verify updated", False, f"Error: {str(e)}")
        results.append(False)
    
    # RESTORE original headline
    try:
        if "page_content_why_us_headline" in original_values:
            resp = requests.post(
                f"{BASE_URL}/cms/page_content",
                headers={"Authorization": f"Bearer {auth_token}"},
                json={
                    "key": "why-us",
                    "data": {"headline": original_values["page_content_why_us_headline"]}
                },
                timeout=10
            )
            passed = resp.status_code == 200
            print_test("Phase 1-3 - page_content RESTORE original", passed, f"Restored headline: '{original_values['page_content_why_us_headline']}'")
            results.append(passed)
        else:
            print_test("Phase 1-3 - page_content RESTORE original", False, "No original headline stored")
            results.append(False)
    except Exception as e:
        print_test("Phase 1-3 - page_content RESTORE original", False, f"Error: {str(e)}")
        results.append(False)
    
    return all(results)

# ============================================================
# 9. PHASE 4: /api/admin/media ENDPOINTS
# ============================================================
def test_phase4_media_endpoints():
    """Test 9: Phase 4 media endpoints"""
    global test_ids
    results = []
    
    # POST /api/admin/media without auth → 401
    try:
        img = Image.new('RGB', (50, 50), color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        resp = requests.post(
            f"{BASE_URL}/admin/media",
            files={"file": ("test-no-auth.png", img_bytes, "image/png")},
            timeout=10
        )
        passed = resp.status_code == 401
        print_test("Phase 4 - POST /admin/media without auth → 401", passed, f"Status: {resp.status_code}")
        results.append(passed)
    except Exception as e:
        print_test("Phase 4 - POST /admin/media without auth → 401", False, f"Error: {str(e)}")
        results.append(False)
    
    # POST /api/admin/media with auth → 200
    try:
        img = Image.new('RGB', (50, 50), color='blue')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        resp = requests.post(
            f"{BASE_URL}/admin/media",
            headers={"Authorization": f"Bearer {auth_token}"},
            files={"file": ("test-phase4.png", img_bytes, "image/png")},
            data={"alt": "Phase 4 test image"},
            timeout=10
        )
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            "media" in data and
            data["media"].get("url", "").startswith("/uploads/") and
            data["media"].get("type") == "image"
        )
        if passed:
            test_ids["phase4_media"] = data["media"]["_id"]
            test_ids["phase4_media_url"] = data["media"]["url"]
        print_test("Phase 4 - POST /admin/media with auth → 200", passed, f"URL: {data.get('media', {}).get('url')}")
        results.append(passed)
    except Exception as e:
        print_test("Phase 4 - POST /admin/media with auth → 200", False, f"Error: {str(e)}")
        results.append(False)
    
    # GET /api/admin/media without auth → 401
    try:
        resp = requests.get(f"{BASE_URL}/admin/media", timeout=10)
        passed = resp.status_code == 401
        print_test("Phase 4 - GET /admin/media without auth → 401", passed, f"Status: {resp.status_code}")
        results.append(passed)
    except Exception as e:
        print_test("Phase 4 - GET /admin/media without auth → 401", False, f"Error: {str(e)}")
        results.append(False)
    
    # GET /api/admin/media with auth → 200
    try:
        resp = requests.get(
            f"{BASE_URL}/admin/media",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        data = resp.json()
        items = data.get("data", [])
        media_id = test_ids.get("phase4_media")
        found = any(m.get("_id") == media_id for m in items)
        passed = resp.status_code == 200 and found
        print_test("Phase 4 - GET /admin/media with auth → 200", passed, f"Found {len(items)} items, uploaded item present: {found}")
        results.append(passed)
    except Exception as e:
        print_test("Phase 4 - GET /admin/media with auth → 200", False, f"Error: {str(e)}")
        results.append(False)
    
    # Verify uploaded file is accessible
    try:
        media_url = test_ids.get("phase4_media_url")
        if media_url:
            full_url = f"https://vayucms-phase4.preview.emergentagent.com{media_url}"
            resp = requests.get(full_url, timeout=10)
            passed = resp.status_code == 200
            print_test("Phase 4 - Verify uploaded file accessible", passed, f"Status: {resp.status_code}, URL: {media_url}")
            results.append(passed)
        else:
            print_test("Phase 4 - Verify uploaded file accessible", False, "No media URL")
            results.append(False)
    except Exception as e:
        print_test("Phase 4 - Verify uploaded file accessible", False, f"Error: {str(e)}")
        results.append(False)
    
    # DELETE /api/admin/media/{id} without auth → 401
    try:
        media_id = test_ids.get("phase4_media")
        if media_id:
            resp = requests.delete(f"{BASE_URL}/admin/media/{media_id}", timeout=10)
            passed = resp.status_code == 401
            print_test("Phase 4 - DELETE /admin/media/{id} without auth → 401", passed, f"Status: {resp.status_code}")
            results.append(passed)
        else:
            print_test("Phase 4 - DELETE /admin/media/{id} without auth → 401", False, "No media ID")
            results.append(False)
    except Exception as e:
        print_test("Phase 4 - DELETE /admin/media/{id} without auth → 401", False, f"Error: {str(e)}")
        results.append(False)
    
    # DELETE /api/admin/media/{id} with auth → 200
    try:
        media_id = test_ids.get("phase4_media")
        if media_id:
            resp = requests.delete(
                f"{BASE_URL}/admin/media/{media_id}",
                headers={"Authorization": f"Bearer {auth_token}"},
                timeout=10
            )
            passed = resp.status_code == 200 and resp.json().get("ok") == True
            print_test("Phase 4 - DELETE /admin/media/{id} with auth → 200", passed, f"Deleted: {passed}")
            results.append(passed)
        else:
            print_test("Phase 4 - DELETE /admin/media/{id} with auth → 200", False, "No media ID")
            results.append(False)
    except Exception as e:
        print_test("Phase 4 - DELETE /admin/media/{id} with auth → 200", False, f"Error: {str(e)}")
        results.append(False)
    
    # Verify doc gone from list
    try:
        resp = requests.get(
            f"{BASE_URL}/admin/media",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        data = resp.json()
        items = data.get("data", [])
        media_id = test_ids.get("phase4_media")
        found = any(m.get("_id") == media_id for m in items)
        passed = resp.status_code == 200 and not found
        print_test("Phase 4 - Verify doc gone from list", passed, f"Doc still present: {found}")
        results.append(passed)
    except Exception as e:
        print_test("Phase 4 - Verify doc gone from list", False, f"Error: {str(e)}")
        results.append(False)
    
    # Verify physical file removed (should 404)
    try:
        media_url = test_ids.get("phase4_media_url")
        if media_url:
            full_url = f"https://vayucms-phase4.preview.emergentagent.com{media_url}"
            resp = requests.get(full_url, timeout=10)
            passed = resp.status_code == 404
            print_test("Phase 4 - Verify physical file removed → 404", passed, f"Status: {resp.status_code}")
            results.append(passed)
        else:
            print_test("Phase 4 - Verify physical file removed → 404", False, "No media URL")
            results.append(False)
    except Exception as e:
        print_test("Phase 4 - Verify physical file removed → 404", False, f"Error: {str(e)}")
        results.append(False)
    
    # Legacy: POST /api/admin/upload still works
    try:
        img = Image.new('RGB', (50, 50), color='green')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        resp = requests.post(
            f"{BASE_URL}/admin/upload",
            headers={"Authorization": f"Bearer {auth_token}"},
            files={"file": ("test-legacy.png", img_bytes, "image/png")},
            timeout=10
        )
        data = resp.json()
        passed = resp.status_code == 200 and "media" in data
        if passed:
            test_ids["legacy_media"] = data["media"]["_id"]
        print_test("Phase 4 - Legacy POST /admin/upload still works", passed, f"ID: {test_ids.get('legacy_media')}")
        results.append(passed)
    except Exception as e:
        print_test("Phase 4 - Legacy POST /admin/upload still works", False, f"Error: {str(e)}")
        results.append(False)
    
    # Delete legacy upload via /api/cms/media/{id}
    try:
        legacy_id = test_ids.get("legacy_media")
        if legacy_id:
            resp = requests.delete(
                f"{BASE_URL}/cms/media/{legacy_id}",
                headers={"Authorization": f"Bearer {auth_token}"},
                timeout=10
            )
            passed = resp.status_code == 200 and resp.json().get("ok") == True
            print_test("Phase 4 - Delete legacy upload via /cms/media/{id}", passed, f"Deleted: {passed}")
            results.append(passed)
        else:
            print_test("Phase 4 - Delete legacy upload via /cms/media/{id}", False, "No legacy ID")
            results.append(False)
    except Exception as e:
        print_test("Phase 4 - Delete legacy upload via /cms/media/{id}", False, f"Error: {str(e)}")
        results.append(False)
    
    return all(results)

# ============================================================
# 10. UNKNOWN COLLECTION
# ============================================================
def test_unknown_collection():
    """Test 10: Unknown collection → 404"""
    try:
        resp = requests.get(f"{BASE_URL}/cms/nonexistent", timeout=10)
        passed = resp.status_code == 404
        print_test("Unknown collection → 404", passed, f"Status: {resp.status_code}")
        return passed
    except Exception as e:
        print_test("Unknown collection → 404", False, f"Error: {str(e)}")
        return False

# ============================================================
# MAIN TEST RUNNER
# ============================================================
def main():
    print("\n" + "="*70)
    print("  VayuCodes CMS Backend API Test Suite - Phase 1-4 Complete")
    print("="*70)
    print(f"  Base URL: {BASE_URL}")
    print(f"  Admin: {ADMIN_EMAIL}")
    print("="*70 + "\n")
    
    all_results = []
    
    # 1. Health
    print_section("1. HEALTH CHECK")
    all_results.append(test_health())
    
    # 2. Auth
    print_section("2. AUTH FLOW")
    all_results.append(test_auth_wrong_password())
    all_results.append(test_auth_login_success())
    all_results.append(test_auth_me_no_token())
    all_results.append(test_auth_me_with_token())
    
    # 3. Regression
    print_section("3. REGRESSION - EXISTING 13 COLLECTIONS")
    all_results.append(test_regression_public_collections())
    all_results.append(test_regression_portfolio_crud())
    
    # 4. Phase 1-3: SiteSettings extended fields
    print_section("4. PHASE 1-3: SITE SETTINGS EXTENDED FIELDS")
    all_results.append(test_site_settings_extended_fields())
    
    # 5. Phase 1-3: how_we_work_steps
    print_section("5. PHASE 1-3: HOW_WE_WORK_STEPS COLLECTION")
    all_results.append(test_how_we_work_steps())
    
    # 6. Phase 1-3: faq_items
    print_section("6. PHASE 1-3: FAQ_ITEMS COLLECTION")
    all_results.append(test_faq_items())
    
    # 7. Phase 1-3: legal_pages KEYED_UPSERT
    print_section("7. PHASE 1-3: LEGAL_PAGES KEYED_UPSERT")
    all_results.append(test_legal_pages_keyed_upsert())
    
    # 8. Phase 1-3: page_content KEYED_UPSERT
    print_section("8. PHASE 1-3: PAGE_CONTENT KEYED_UPSERT")
    all_results.append(test_page_content_keyed_upsert())
    
    # 9. Phase 4: /api/admin/media endpoints
    print_section("9. PHASE 4: /api/admin/media ENDPOINTS")
    all_results.append(test_phase4_media_endpoints())
    
    # 10. Unknown collection
    print_section("10. UNKNOWN COLLECTION")
    all_results.append(test_unknown_collection())
    
    # Summary
    print("\n" + "="*70)
    print("  TEST SUMMARY")
    print("="*70)
    passed = sum(all_results)
    total = len(all_results)
    print(f"\n  Total: {passed}/{total} test groups passed")
    print(f"  Success rate: {(passed/total)*100:.1f}%\n")
    
    if passed == total:
        print("  ✅ ALL TESTS PASSED - Backend is production-ready!")
    else:
        print(f"  ❌ {total - passed} TEST GROUP(S) FAILED")
    
    print("="*70 + "\n")
    
    return passed == total

if __name__ == "__main__":
    import sys
    success = main()
    sys.exit(0 if success else 1)
