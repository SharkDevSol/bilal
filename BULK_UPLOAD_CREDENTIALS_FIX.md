# Bulk Upload Credentials Fix

## Problem
When uploading staff via Excel, the system showed "Successfully imported X staff" and displayed username/password, but staff couldn't login with those credentials. The credentials worked for individual registration but not bulk uploadause it was comparing a plain password with bcrypt

## Solution
Changed the bulk-import route to use the `createStaffUser()` function (same as individual registration):
- Generates randosword
- The comparison failed bechen staff tried to login, the system used `bcrypt.compare()` which expects a hashed pasirectly to `password_hash` column (NOT hashed!)
- WORRECTLY:
- It was saving the plain password d.

## Root Cause
The bulk-import route was manually generating credentials and saving them INC