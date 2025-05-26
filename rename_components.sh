#!/bin/bash

# Define your renaming map: old filename => new filename
declare -A FILE_MAP=(
  ["NewEntry.jsx"]="NewEntryForm.jsx"
  ["EntryTable.jsx"]="NewEntryFormTable.jsx"
  ["TenantDomain.jsx"]="TenantDomainList.jsx"
  ["DomainTenantTable.jsx"]="TenantDomainListTable.jsx"
  ["FullTable.jsx"]="FullDatabaseList.jsx"
  ["FullDatabaseTable.jsx"]="FullDatabaseListTable.jsx"
  ["LastEntriesTable.jsx"]="DashboardLastEntriesTable.jsx"
  ["MapView.jsx"]="DashboardMapView.jsx"
)

# 1. Rename files
for old in "${!FILE_MAP[@]}"; do
  new="${FILE_MAP[$old]}"
  # Find and rename files (case-sensitive, in src/components and src/pages)
  for f in $(find ./frontend/src -name "$old"); do
    git mv "$f" "$(dirname "$f")/$new" 2>/dev/null || mv "$f" "$(dirname "$f")/$new"
    echo "Renamed $f -> $(dirname "$f")/$new"
  done
done

# 2. Update import statements in all .js/.jsx/.ts/.tsx files
for old in "${!FILE_MAP[@]}"; do
  new="${FILE_MAP[$old]}"
  # Remove .jsx extension for import paths
  oldImport="${old%.jsx}"
  newImport="${new%.jsx}"
  # Replace in all source files
  grep -rl --exclude-dir=node_modules --exclude-dir=.git "$oldImport" ./frontend/src | while read file; do
    sed -i "s/$oldImport/$newImport/g" "$file"
    echo "Updated import in $file: $oldImport -> $newImport"
  done
done

echo "File renaming and import updates complete!"

# 3. (Optional) Update component names inside files
# You can uncomment this block if you want to also rename the component names inside the files.
# for old in "${!FILE_MAP[@]}"; do
#   new="${FILE_MAP[$old]}"
#   oldComp="${old%.jsx}"
#   newComp="${new%.jsx}"
#   grep -rl --exclude-dir=node_modules --exclude-dir=.git "$oldComp" ./frontend/src | while read file; do
#     sed -i "s/\b$oldComp\b/$newComp/g" "$file"
#     echo "Updated component name in $file: $oldComp -> $newComp"
#   done
# done

echo "All done!"