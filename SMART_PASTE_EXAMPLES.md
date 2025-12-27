# Smart Paste Examples for Projects

The Projects tab now includes an intelligent parser that can extract information from pasted text. Here are some examples:

## Example 1: Churchill Fellowship

```
Churchill Fellowship
The Churchill Fellowship provides funding for Australians to travel overseas to research and bring back innovative ideas. Applications open February 1, 2025 and close March 31, 2025. Successful applicants will be notified by June 15, 2025. The fellowship runs from September 1, 2025 to March 1, 2026.
Website: https://www.churchilltrust.com.au
```

**What it extracts:**
- Title: "Churchill Fellowship"
- Description: "The Churchill Fellowship provides funding..."
- Category: Fellowship (detected from keyword)
- Application Opens: Feb 1, 2025
- Deadline: Mar 31, 2025
- Notification: Jun 15, 2025
- Program Start: Sep 1, 2025
- Program End: Mar 1, 2026
- URL: https://www.churchilltrust.com.au

## Example 2: SXSW Sydney Speaker

```
SXSW Sydney Speaker Opportunity
Submit your speaking proposal for SXSW Sydney 2025. We're looking for innovative presentations on technology and social impact.
Deadline: May 15, 2025
Event dates: October 15-19, 2025
Apply at: https://sxswsydney.com/speakers
```

**What it extracts:**
- Title: "SXSW Sydney Speaker Opportunity"
- Category: Speaking (detected from "speaker" keyword)
- Deadline: May 15, 2025
- Program Start: Oct 15, 2025
- Program End: Oct 19, 2025
- URL: https://sxswsydney.com/speakers

## Example 3: Fulbright Scholarship

```
Fulbright Professional Scholarship - Alliance Studies
High priority scholarship for US-Australia exchange program
Applications open: 01/02/2025
Closing date: 31/05/2025
Results announced: September 1, 2025
Program: January 15, 2026 - December 15, 2026
More info: https://fulbright.org.au
```

**What it extracts:**
- Title: "Fulbright Professional Scholarship - Alliance Studies"
- Category: Scholarship (detected from keyword)
- Priority: High (detected from "high priority")
- Application Opens: Feb 1, 2025
- Deadline: May 31, 2025
- Notification: Sep 1, 2025
- Program Start: Jan 15, 2026
- Program End: Dec 15, 2026
- URL: https://fulbright.org.au

## Supported Date Formats

The parser recognizes multiple date formats:
- DD/MM/YYYY (e.g., 31/12/2025)
- DD-MM-YYYY (e.g., 31-12-2025)
- YYYY-MM-DD (e.g., 2025-12-31)
- Month DD, YYYY (e.g., December 31, 2025)
- DD Month YYYY (e.g., 31 December 2025)
- Abbreviated months (e.g., Dec 31, 2025)

## Keywords Detected

**Categories:**
- Fellowship: "fellowship"
- Scholarship: "scholarship"
- Speaking: "speaker", "speaking", "presentation"
- Leadership: "leader", "leadership"

**Dates:**
- Opens: "open", "opens", "opening", "applications open"
- Deadline: "deadline", "due", "close", "closes", "submit by"
- Notification: "notification", "notify", "announce", "results"
- Start: "start", "begins", "commence", "program start"
- End: "end", "finish", "conclude", "program end"

**Priority:**
- High: "urgent", "high priority", "important"
- Low: "low priority"

## Tips for Best Results

1. **Include the title on the first line** - The parser uses the first line as the title
2. **Use clear date keywords** - Words like "deadline", "opens", "starts" help identify dates
3. **Include URLs** - Any https:// link will be extracted
4. **Mention category keywords** - Use words like "fellowship", "scholarship", "speaking"
5. **Be specific about dates** - Include full dates with year for best accuracy

## How to Use

1. Click "Add Project" button
2. Paste your project details in the "Smart Paste" textarea
3. Click "🔍 Parse Information"
4. Review and adjust the auto-filled fields
5. Click "Create Project"

The parser will automatically fill in all detected information, and you can manually adjust any fields before saving!
