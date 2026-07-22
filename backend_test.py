#!/usr/bin/env python3
"""
VayuCodes CMS Backend API Test Suite
Tests all endpoints end-to-end as per review request
"""

import requests
import json
import io
from PIL import Image

BASE_URL = "http://localhost:3000/api"
ADMIN_EMAIL = "admin@vayucodes.com"
ADMIN_PASSWORD = "VayuAdmin@2026"

# Global token storage
auth_token = None
test_ids = {}

def print_test(name, passed, details=""):
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status} | {name}")
    if details:
        print(f"    {details}")
    print()

def test_health():
    """Test 1: Health endpoint"""
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

def test_login_wrong_password():
    """Test 2.1: Login with wrong password"""
    try:
        resp = requests.post(
            f"{BASE_URL}/admin/login",
            json={"email": ADMIN_EMAIL, "password": "WrongPassword123"},
            timeout=10
        )
        passed = resp.status_code == 401
        print_test("Login - Wrong Password", passed, f"Status: {resp.status_code}, Response: {resp.json()}")
        return passed
    except Exception as e:
        print_test("Login - Wrong Password", False, f"Error: {str(e)}")
        return False

def test_login_wrong_email():
    """Test 2.2: Login with wrong email"""
    try:
        resp = requests.post(
            f"{BASE_URL}/admin/login",
            json={"email": "wrong@example.com", "password": ADMIN_PASSWORD},
            timeout=10
        )
        passed = resp.status_code == 401
        print_test("Login - Wrong Email", passed, f"Status: {resp.status_code}, Response: {resp.json()}")
        return passed
    except Exception as e:
        print_test("Login - Wrong Email", False, f"Error: {str(e)}")
        return False

def test_login_no_body():
    """Test 2.3: Login without body"""
    try:
        resp = requests.post(f"{BASE_URL}/admin/login", json={}, timeout=10)
        passed = resp.status_code == 400
        print_test("Login - No Body", passed, f"Status: {resp.status_code}, Response: {resp.json()}")
        return passed
    except Exception as e:
        print_test("Login - No Body", False, f"Error: {str(e)}")
        return False

def test_login_success():
    """Test 2.4: Login with correct credentials"""
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
            "admin" in data and
            data["admin"].get("email") == ADMIN_EMAIL
        )
        if passed:
            auth_token = data["token"]
        print_test("Login - Success", passed, f"Token received: {bool(auth_token)}, Admin: {data.get('admin', {})}")
        return passed
    except Exception as e:
        print_test("Login - Success", False, f"Error: {str(e)}")
        return False

def test_me_no_token():
    """Test 2.5: GET /admin/me without token"""
    try:
        resp = requests.get(f"{BASE_URL}/admin/me", timeout=10)
        passed = resp.status_code == 401
        print_test("Admin Me - No Token", passed, f"Status: {resp.status_code}")
        return passed
    except Exception as e:
        print_test("Admin Me - No Token", False, f"Error: {str(e)}")
        return False

def test_me_invalid_token():
    """Test 2.6: GET /admin/me with invalid token"""
    try:
        resp = requests.get(
            f"{BASE_URL}/admin/me",
            headers={"Authorization": "Bearer invalid_token_12345"},
            timeout=10
        )
        passed = resp.status_code == 401
        print_test("Admin Me - Invalid Token", passed, f"Status: {resp.status_code}")
        return passed
    except Exception as e:
        print_test("Admin Me - Invalid Token", False, f"Error: {str(e)}")
        return False

def test_me_valid_token():
    """Test 2.7: GET /admin/me with valid token"""
    try:
        resp = requests.get(
            f"{BASE_URL}/admin/me",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            "admin" in data and
            data["admin"].get("email") == ADMIN_EMAIL
        )
        print_test("Admin Me - Valid Token", passed, f"Admin: {data.get('admin', {})}")
        return passed
    except Exception as e:
        print_test("Admin Me - Valid Token", False, f"Error: {str(e)}")
        return False

def test_public_team_members():
    """Test 3.1: GET /cms/team_members (public)"""
    try:
        resp = requests.get(f"{BASE_URL}/cms/team_members", timeout=10)
        data = resp.json()
        passed = resp.status_code == 200 and "data" in data
        members = data.get("data", [])
        co_founders = [m for m in members if m.get("isCoFounder")]
        print_test(
            "Public - Team Members",
            passed,
            f"Found {len(members)} members, {len(co_founders)} co-founders. Names: {[m.get('name') for m in co_founders]}"
        )
        return passed
    except Exception as e:
        print_test("Public - Team Members", False, f"Error: {str(e)}")
        return False

def test_public_portfolio():
    """Test 3.2: GET /cms/portfolio_projects (public)"""
    try:
        resp = requests.get(f"{BASE_URL}/cms/portfolio_projects", timeout=10)
        data = resp.json()
        passed = resp.status_code == 200 and "data" in data
        projects = data.get("data", [])
        print_test("Public - Portfolio Projects", passed, f"Found {len(projects)} projects")
        return passed
    except Exception as e:
        print_test("Public - Portfolio Projects", False, f"Error: {str(e)}")
        return False

def test_public_services():
    """Test 3.3: GET /cms/services (public)"""
    try:
        resp = requests.get(f"{BASE_URL}/cms/services", timeout=10)
        data = resp.json()
        passed = resp.status_code == 200 and "data" in data
        services = data.get("data", [])
        print_test("Public - Services", passed, f"Found {len(services)} services")
        return passed
    except Exception as e:
        print_test("Public - Services", False, f"Error: {str(e)}")
        return False

def test_public_testimonials():
    """Test 3.4: GET /cms/testimonials (public)"""
    try:
        resp = requests.get(f"{BASE_URL}/cms/testimonials", timeout=10)
        data = resp.json()
        passed = resp.status_code == 200 and "data" in data
        testimonials = data.get("data", [])
        print_test("Public - Testimonials", passed, f"Found {len(testimonials)} testimonials")
        return passed
    except Exception as e:
        print_test("Public - Testimonials", False, f"Error: {str(e)}")
        return False

def test_public_pages():
    """Test 3.5: GET /cms/pages (public)"""
    try:
        resp = requests.get(f"{BASE_URL}/cms/pages", timeout=10)
        data = resp.json()
        passed = resp.status_code == 200 and "data" in data
        pages = data.get("data", [])
        print_test("Public - Pages", passed, f"Found {len(pages)} pages")
        return passed
    except Exception as e:
        print_test("Public - Pages", False, f"Error: {str(e)}")
        return False

def test_public_site_settings():
    """Test 3.6: GET /cms/site_settings (singleton)"""
    try:
        resp = requests.get(f"{BASE_URL}/cms/site_settings", timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            "data" in data and
            data["data"].get("_id") == "main"
        )
        print_test("Public - Site Settings (Singleton)", passed, f"Site name: {data.get('data', {}).get('siteName')}")
        return passed
    except Exception as e:
        print_test("Public - Site Settings (Singleton)", False, f"Error: {str(e)}")
        return False

def test_public_navigation():
    """Test 3.7: GET /cms/navigation (singleton)"""
    try:
        resp = requests.get(f"{BASE_URL}/cms/navigation", timeout=10)
        data = resp.json()
        passed = resp.status_code == 200 and "data" in data
        print_test("Public - Navigation (Singleton)", passed, f"_id: {data.get('data', {}).get('_id')}")
        return passed
    except Exception as e:
        print_test("Public - Navigation (Singleton)", False, f"Error: {str(e)}")
        return False

def test_public_footer():
    """Test 3.8: GET /cms/footer (singleton)"""
    try:
        resp = requests.get(f"{BASE_URL}/cms/footer", timeout=10)
        data = resp.json()
        passed = resp.status_code == 200 and "data" in data
        print_test("Public - Footer (Singleton)", passed, f"_id: {data.get('data', {}).get('_id')}")
        return passed
    except Exception as e:
        print_test("Public - Footer (Singleton)", False, f"Error: {str(e)}")
        return False

def test_public_contact_settings():
    """Test 3.9: GET /cms/contact_settings (singleton)"""
    try:
        resp = requests.get(f"{BASE_URL}/cms/contact_settings", timeout=10)
        data = resp.json()
        passed = resp.status_code == 200 and "data" in data
        print_test("Public - Contact Settings (Singleton)", passed, f"_id: {data.get('data', {}).get('_id')}")
        return passed
    except Exception as e:
        print_test("Public - Contact Settings (Singleton)", False, f"Error: {str(e)}")
        return False

def test_public_seo_settings():
    """Test 3.10: GET /cms/seo_settings (singleton)"""
    try:
        resp = requests.get(f"{BASE_URL}/cms/seo_settings", timeout=10)
        data = resp.json()
        passed = resp.status_code == 200 and "data" in data
        print_test("Public - SEO Settings (Singleton)", passed, f"_id: {data.get('data', {}).get('_id')}")
        return passed
    except Exception as e:
        print_test("Public - SEO Settings (Singleton)", False, f"Error: {str(e)}")
        return False

def test_public_media():
    """Test 3.11: GET /cms/media (public)"""
    try:
        resp = requests.get(f"{BASE_URL}/cms/media", timeout=10)
        data = resp.json()
        passed = resp.status_code == 200 and "data" in data
        media = data.get("data", [])
        print_test("Public - Media", passed, f"Found {len(media)} media items")
        return passed
    except Exception as e:
        print_test("Public - Media", False, f"Error: {str(e)}")
        return False

def test_create_portfolio_no_auth():
    """Test 4.1: POST /cms/portfolio_projects without token"""
    try:
        resp = requests.post(
            f"{BASE_URL}/cms/portfolio_projects",
            json={"title": "Test", "slug": "test"},
            timeout=10
        )
        passed = resp.status_code == 401
        print_test("Create Portfolio - No Auth", passed, f"Status: {resp.status_code}")
        return passed
    except Exception as e:
        print_test("Create Portfolio - No Auth", False, f"Error: {str(e)}")
        return False

def test_create_portfolio_with_auth():
    """Test 4.2: POST /cms/portfolio_projects with auth"""
    global test_ids
    try:
        resp = requests.post(
            f"{BASE_URL}/cms/portfolio_projects",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "title": "Test Project",
                "slug": "test-project-backend-test",
                "category": "Test",
                "themeColor": "#000000",
                "published": True
            },
            timeout=10
        )
        data = resp.json()
        passed = resp.status_code == 200 and "data" in data and "_id" in data["data"]
        if passed:
            test_ids["portfolio"] = data["data"]["_id"]
        print_test("Create Portfolio - With Auth", passed, f"Created ID: {test_ids.get('portfolio')}")
        return passed
    except Exception as e:
        print_test("Create Portfolio - With Auth", False, f"Error: {str(e)}")
        return False

def test_get_portfolio_by_id():
    """Test 4.3: GET /cms/portfolio_projects/{id}"""
    try:
        portfolio_id = test_ids.get("portfolio")
        if not portfolio_id:
            print_test("Get Portfolio By ID", False, "No portfolio ID available")
            return False
        
        resp = requests.get(f"{BASE_URL}/cms/portfolio_projects/{portfolio_id}", timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            "data" in data and
            data["data"].get("_id") == portfolio_id
        )
        print_test("Get Portfolio By ID", passed, f"Title: {data.get('data', {}).get('title')}")
        return passed
    except Exception as e:
        print_test("Get Portfolio By ID", False, f"Error: {str(e)}")
        return False

def test_update_portfolio():
    """Test 4.4: PUT /cms/portfolio_projects/{id}"""
    try:
        portfolio_id = test_ids.get("portfolio")
        if not portfolio_id:
            print_test("Update Portfolio", False, "No portfolio ID available")
            return False
        
        resp = requests.put(
            f"{BASE_URL}/cms/portfolio_projects/{portfolio_id}",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"title": "Test Project Updated"},
            timeout=10
        )
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            "data" in data and
            data["data"].get("title") == "Test Project Updated"
        )
        print_test("Update Portfolio", passed, f"New title: {data.get('data', {}).get('title')}")
        return passed
    except Exception as e:
        print_test("Update Portfolio", False, f"Error: {str(e)}")
        return False

def test_delete_portfolio():
    """Test 4.5: DELETE /cms/portfolio_projects/{id}"""
    try:
        portfolio_id = test_ids.get("portfolio")
        if not portfolio_id:
            print_test("Delete Portfolio", False, "No portfolio ID available")
            return False
        
        resp = requests.delete(
            f"{BASE_URL}/cms/portfolio_projects/{portfolio_id}",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        data = resp.json()
        passed = resp.status_code == 200 and data.get("ok") == True
        print_test("Delete Portfolio", passed, f"Response: {data}")
        return passed
    except Exception as e:
        print_test("Delete Portfolio", False, f"Error: {str(e)}")
        return False

def test_get_deleted_portfolio():
    """Test 4.6: GET /cms/portfolio_projects/{id} after delete"""
    try:
        portfolio_id = test_ids.get("portfolio")
        if not portfolio_id:
            print_test("Get Deleted Portfolio", False, "No portfolio ID available")
            return False
        
        resp = requests.get(f"{BASE_URL}/cms/portfolio_projects/{portfolio_id}", timeout=10)
        passed = resp.status_code == 404
        print_test("Get Deleted Portfolio - Should 404", passed, f"Status: {resp.status_code}")
        return passed
    except Exception as e:
        print_test("Get Deleted Portfolio - Should 404", False, f"Error: {str(e)}")
        return False

def test_team_crud():
    """Test 5: Team CRUD operations"""
    global test_ids
    results = []
    
    # Create
    try:
        resp = requests.post(
            f"{BASE_URL}/cms/team_members",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "name": "Test Person",
                "role": "Test Role",
                "published": True
            },
            timeout=10
        )
        data = resp.json()
        passed = resp.status_code == 200 and "data" in data and "_id" in data["data"]
        if passed:
            test_ids["team"] = data["data"]["_id"]
        print_test("Create Team Member", passed, f"Created ID: {test_ids.get('team')}")
        results.append(passed)
    except Exception as e:
        print_test("Create Team Member", False, f"Error: {str(e)}")
        results.append(False)
    
    # Update
    try:
        team_id = test_ids.get("team")
        if team_id:
            resp = requests.put(
                f"{BASE_URL}/cms/team_members/{team_id}",
                headers={"Authorization": f"Bearer {auth_token}"},
                json={"bio": "Updated bio for testing"},
                timeout=10
            )
            data = resp.json()
            passed = resp.status_code == 200 and data.get("data", {}).get("bio") == "Updated bio for testing"
            print_test("Update Team Member", passed, f"Bio updated: {passed}")
            results.append(passed)
        else:
            print_test("Update Team Member", False, "No team ID available")
            results.append(False)
    except Exception as e:
        print_test("Update Team Member", False, f"Error: {str(e)}")
        results.append(False)
    
    # Delete
    try:
        team_id = test_ids.get("team")
        if team_id:
            resp = requests.delete(
                f"{BASE_URL}/cms/team_members/{team_id}",
                headers={"Authorization": f"Bearer {auth_token}"},
                timeout=10
            )
            passed = resp.status_code == 200 and resp.json().get("ok") == True
            print_test("Delete Team Member", passed, f"Deleted: {passed}")
            results.append(passed)
        else:
            print_test("Delete Team Member", False, "No team ID available")
            results.append(False)
    except Exception as e:
        print_test("Delete Team Member", False, f"Error: {str(e)}")
        results.append(False)
    
    return all(results)

def test_singleton_upsert():
    """Test 6: Singleton upsert behavior"""
    results = []
    
    # First POST
    try:
        resp = requests.post(
            f"{BASE_URL}/cms/site_settings",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"siteName": "Updated Site Name Test"},
            timeout=10
        )
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            data.get("data", {}).get("_id") == "main" and
            data.get("data", {}).get("siteName") == "Updated Site Name Test"
        )
        print_test("Singleton Upsert - First POST", passed, f"_id: {data.get('data', {}).get('_id')}")
        results.append(passed)
    except Exception as e:
        print_test("Singleton Upsert - First POST", False, f"Error: {str(e)}")
        results.append(False)
    
    # GET to verify
    try:
        resp = requests.get(f"{BASE_URL}/cms/site_settings", timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            data.get("data", {}).get("siteName") == "Updated Site Name Test"
        )
        print_test("Singleton Upsert - GET Verify", passed, f"Site name: {data.get('data', {}).get('siteName')}")
        results.append(passed)
    except Exception as e:
        print_test("Singleton Upsert - GET Verify", False, f"Error: {str(e)}")
        results.append(False)
    
    # Second POST with different data
    try:
        resp = requests.post(
            f"{BASE_URL}/cms/site_settings",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"siteName": "Another Update", "tagline": "Test tagline"},
            timeout=10
        )
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            data.get("data", {}).get("_id") == "main"
        )
        print_test("Singleton Upsert - Second POST (should still be _id=main)", passed, f"_id: {data.get('data', {}).get('_id')}")
        results.append(passed)
    except Exception as e:
        print_test("Singleton Upsert - Second POST", False, f"Error: {str(e)}")
        results.append(False)
    
    # Try to DELETE singleton (should fail)
    try:
        resp = requests.delete(
            f"{BASE_URL}/cms/site_settings/main",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        passed = resp.status_code == 400
        print_test("Singleton Delete - Should Fail", passed, f"Status: {resp.status_code}, Response: {resp.json()}")
        results.append(passed)
    except Exception as e:
        print_test("Singleton Delete - Should Fail", False, f"Error: {str(e)}")
        results.append(False)
    
    return all(results)

def test_file_upload():
    """Test 7: File upload"""
    global test_ids
    results = []
    
    # Upload without token
    try:
        # Create a small test image
        img = Image.new('RGB', (100, 100), color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        resp = requests.post(
            f"{BASE_URL}/admin/upload",
            files={"file": ("test.png", img_bytes, "image/png")},
            timeout=10
        )
        passed = resp.status_code == 401
        print_test("File Upload - No Auth", passed, f"Status: {resp.status_code}")
        results.append(passed)
    except Exception as e:
        print_test("File Upload - No Auth", False, f"Error: {str(e)}")
        results.append(False)
    
    # Upload with token
    try:
        img = Image.new('RGB', (100, 100), color='blue')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        resp = requests.post(
            f"{BASE_URL}/admin/upload",
            headers={"Authorization": f"Bearer {auth_token}"},
            files={"file": ("test-backend.png", img_bytes, "image/png")},
            data={"alt": "Test image from backend test"},
            timeout=10
        )
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            "media" in data and
            "url" in data["media"] and
            data["media"]["url"].startswith("/uploads/")
        )
        if passed:
            test_ids["media"] = data["media"]["_id"]
            test_ids["media_url"] = data["media"]["url"]
        print_test("File Upload - With Auth", passed, f"URL: {data.get('media', {}).get('url')}")
        results.append(passed)
    except Exception as e:
        print_test("File Upload - With Auth", False, f"Error: {str(e)}")
        results.append(False)
    
    # Verify media appears in list
    try:
        resp = requests.get(f"{BASE_URL}/cms/media", timeout=10)
        data = resp.json()
        media_list = data.get("data", [])
        media_id = test_ids.get("media")
        found = any(m.get("_id") == media_id for m in media_list)
        passed = resp.status_code == 200 and found
        print_test("File Upload - Verify in Media List", passed, f"Found uploaded file: {found}")
        results.append(passed)
    except Exception as e:
        print_test("File Upload - Verify in Media List", False, f"Error: {str(e)}")
        results.append(False)
    
    # Verify file exists (HEAD request)
    try:
        media_url = test_ids.get("media_url")
        if media_url:
            full_url = f"http://localhost:3000{media_url}"
            resp = requests.head(full_url, timeout=10)
            passed = resp.status_code == 200
            print_test("File Upload - Verify File Exists", passed, f"Status: {resp.status_code}")
            results.append(passed)
        else:
            print_test("File Upload - Verify File Exists", False, "No media URL available")
            results.append(False)
    except Exception as e:
        print_test("File Upload - Verify File Exists", False, f"Error: {str(e)}")
        results.append(False)
    
    return all(results)

def test_unknown_collection():
    """Test 8: Unknown collection"""
    try:
        resp = requests.get(f"{BASE_URL}/cms/does_not_exist", timeout=10)
        data = resp.json()
        passed = resp.status_code == 404 and "error" in data
        print_test("Unknown Collection", passed, f"Status: {resp.status_code}, Error: {data.get('error')}")
        return passed
    except Exception as e:
        print_test("Unknown Collection", False, f"Error: {str(e)}")
        return False

def test_contact_lead():
    """Test 9: Contact leads endpoint"""
    results = []
    
    # Without required fields
    try:
        resp = requests.post(
            f"{BASE_URL}/contact",
            json={"message": "hi"},
            timeout=10
        )
        passed = resp.status_code == 400
        print_test("Contact Lead - Missing Fields", passed, f"Status: {resp.status_code}")
        results.append(passed)
    except Exception as e:
        print_test("Contact Lead - Missing Fields", False, f"Error: {str(e)}")
        results.append(False)
    
    # With all fields
    try:
        resp = requests.post(
            f"{BASE_URL}/contact",
            json={
                "name": "Test User",
                "email": "test@example.com",
                "message": "This is a test message from backend test"
            },
            timeout=10
        )
        data = resp.json()
        passed = resp.status_code == 200 and data.get("ok") == True and "id" in data
        print_test("Contact Lead - Success", passed, f"Lead ID: {data.get('id')}")
        results.append(passed)
    except Exception as e:
        print_test("Contact Lead - Success", False, f"Error: {str(e)}")
        results.append(False)
    
    return all(results)

def cleanup_test_data():
    """Clean up test data created during tests"""
    print("\n" + "="*60)
    print("CLEANUP - Removing test data")
    print("="*60 + "\n")
    
    # Delete test media if created
    if "media" in test_ids:
        try:
            resp = requests.delete(
                f"{BASE_URL}/cms/media/{test_ids['media']}",
                headers={"Authorization": f"Bearer {auth_token}"},
                timeout=10
            )
            print(f"Deleted test media: {resp.status_code == 200}")
        except Exception as e:
            print(f"Failed to delete test media: {str(e)}")
    
    # Restore site_settings to original
    try:
        resp = requests.post(
            f"{BASE_URL}/cms/site_settings",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"siteName": "VayuCodes"},
            timeout=10
        )
        print(f"Restored site_settings: {resp.status_code == 200}")
    except Exception as e:
        print(f"Failed to restore site_settings: {str(e)}")

def main():
    print("\n" + "="*60)
    print("VayuCodes CMS Backend API Test Suite")
    print("="*60 + "\n")
    
    all_results = []
    
    # Test 1: Health
    all_results.append(test_health())
    
    # Test 2: Auth flow
    all_results.append(test_login_wrong_password())
    all_results.append(test_login_wrong_email())
    all_results.append(test_login_no_body())
    all_results.append(test_login_success())
    all_results.append(test_me_no_token())
    all_results.append(test_me_invalid_token())
    all_results.append(test_me_valid_token())
    
    # Test 3: Public reads
    all_results.append(test_public_team_members())
    all_results.append(test_public_portfolio())
    all_results.append(test_public_services())
    all_results.append(test_public_testimonials())
    all_results.append(test_public_pages())
    all_results.append(test_public_site_settings())
    all_results.append(test_public_navigation())
    all_results.append(test_public_footer())
    all_results.append(test_public_contact_settings())
    all_results.append(test_public_seo_settings())
    all_results.append(test_public_media())
    
    # Test 4: Auth-required writes (Portfolio CRUD)
    all_results.append(test_create_portfolio_no_auth())
    all_results.append(test_create_portfolio_with_auth())
    all_results.append(test_get_portfolio_by_id())
    all_results.append(test_update_portfolio())
    all_results.append(test_delete_portfolio())
    all_results.append(test_get_deleted_portfolio())
    
    # Test 5: Team CRUD
    all_results.append(test_team_crud())
    
    # Test 6: Singleton upsert
    all_results.append(test_singleton_upsert())
    
    # Test 7: File upload
    all_results.append(test_file_upload())
    
    # Test 8: Unknown collection
    all_results.append(test_unknown_collection())
    
    # Test 9: Contact leads
    all_results.append(test_contact_lead())
    
    # Cleanup
    cleanup_test_data()
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    passed = sum(all_results)
    total = len(all_results)
    print(f"\nTotal: {passed}/{total} tests passed")
    print(f"Success rate: {(passed/total)*100:.1f}%\n")
    
    if passed == total:
        print("✅ ALL TESTS PASSED")
    else:
        print(f"❌ {total - passed} TEST(S) FAILED")
    
    return passed == total

if __name__ == "__main__":
    import sys
    success = main()
    sys.exit(0 if success else 1)
