#!/bin/bash

# Fix AddDeductionModal.jsx
sed -i "s|const API_URL = import.meta.env.VITE_API_URL \|\| 'https://iqrab3.skoolific.com';|const API_URL = import.meta.env.VITE_API_URL \|\| 'https://iqrab3.skoolific.com/api';|g" APP/src/PAGE/HR/components/AddDeductionModal.jsx
sed -i 's|`${API_URL}/api/hr/salary/|`${API_URL}/hr/salary/|g' APP/src/PAGE/HR/components/AddDeductionModal.jsx

# Fix AddRetentionModal.jsx
sed -i "s|const API_URL = import.meta.env.VITE_API_URL \|\| 'https://iqrab3.skoolific.com';|const API_URL = import.meta.env.VITE_API_URL \|\| 'https://iqrab3.skoolific.com/api';|g" APP/src/PAGE/HR/components/AddRetentionModal.jsx
sed -i 's|`${API_URL}/api/hr/salary/|`${API_URL}/hr/salary/|g' APP/src/PAGE/HR/components/AddRetentionModal.jsx

# Fix AddRetentionBenefitModal.jsx
sed -i "s|const API_URL = import.meta.env.VITE_API_URL \|\| 'https://iqrab3.skoolific.com';|const API_URL = import.meta.env.VITE_API_URL \|\| 'https://iqrab3.skoolific.com/api';|g" APP/src/PAGE/HR/components/AddRetentionBenefitModal.jsx
sed -i 's|`${API_URL}/api/hr/salary/|`${API_URL}/hr/salary/|g' APP/src/PAGE/HR/components/AddRetentionBenefitModal.jsx

# Fix EditSalaryModal.jsx
sed -i "s|const API_URL = import.meta.env.VITE_API_URL \|\| 'https://iqrab3.skoolific.com';|const API_URL = import.meta.env.VITE_API_URL \|\| 'https://iqrab3.skoolific.com/api';|g" APP/src/PAGE/HR/components/EditSalaryModal.jsx
sed -i 's|`${API_URL}/api/hr/salary/|`${API_URL}/hr/salary/|g' APP/src/PAGE/HR/components/EditSalaryModal.jsx

# Fix StaffDeductionsAllowancesModal.jsx
sed -i "s|const API_URL = import.meta.env.VITE_API_URL \|\| 'https://iqrab3.skoolific.com';|const API_URL = import.meta.env.VITE_API_URL \|\| 'https://iqrab3.skoolific.com/api';|g' APP/src/PAGE/HR/components/StaffDeductionsAllowancesModal.jsx
sed -i 's|`${API_URL}/api/hr/salary/|`${API_URL}/hr/salary/|g' APP/src/PAGE/HR/components/StaffDeductionsAllowancesModal.jsx

echo "All API URLs fixed!"
