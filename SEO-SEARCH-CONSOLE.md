# CRUMB — Google Search Console setup

Public site: https://crumb.vision/
Sitemap: https://crumb.vision/sitemap.xml
Robots: https://crumb.vision/robots.txt

The code includes canonical URLs, robots directives, relevant description, and social-sharing metadata on the two public HTML pages. The sitemap lists those pages, not API endpoints or duplicate `*.vercel.app` addresses.

## Site owner: submit to Google

1. Open https://search.google.com/search-console and sign into the Google account that should own CRUMB.
2. **Add property → Domain**; enter only `crumb.vision` (no scheme or www).
3. Copy the **unique** DNS TXT value Google provides. In Hostinger → Domains → crumb.vision → DNS / Nameservers → DNS records, add a new **TXT** record with Name `@` and Value exactly the Google verification string. Keep the existing Vercel A and www CNAME records unchanged.
4. Return to Search Console and choose **Verify**. DNS propagation may cause a delay. Keep the TXT record in DNS so ownership remains verified.
5. Search Console → **Sitemaps** → enter `sitemap.xml` → Submit.
6. In **URL inspection**, enter `https://crumb.vision/`, test the live URL and click **Request indexing** if offered.
7. Monitor **Pages / Indexing** for indexing, crawl or canonical issues. Google's indexing and ranking are not guaranteed and can take time.

Do not publish your verification token or any Google credentials in GitHub or chat. Do not mistake a verification TXT record for a password; nonetheless, copy it exactly and keep domain ownership under your control.

The site is hosted at Vercel, while Hostinger manages DNS. Search Console verification changes DNS only; it does not migrate the website.
