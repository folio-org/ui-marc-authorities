# Change history for ui-marc-authorities

## [5.0.0] IN PROGRESS

- [UIMARCAUTH-304](https://issues.folio.org/browse/UIMARCAUTH-304) Remove eslint deps that are already listed in eslint-config-stripes.
- [UIMARCAUTH-339](https://issues.folio.org/browse/UIMARCAUTH-339) *BREAKING* Replace imports from quick-marc with stripes-marc-components.
- [UIMARCAUTH-343](https://issues.folio.org/browse/UIMARCAUTH-343) Add new column called Authority source for the browse and search results.
- [UIMARCAUTH-352](https://issues.folio.org/browse/UIMARCAUTH-352) Change create MARC authority action label.
- [UIMARCAUTH-340](https://issues.folio.org/browse/UIMARCAUTH-340) *BREAKING* Change API URL to delete MARC authority record.
- [UIMARCAUTH-344](https://issues.folio.org/browse/UIMARCAUTH-344) Added permissions for viewing and editing/creating/deleting Authority Source files in Settings
- [UIMARCAUTH-336](https://issues.folio.org/browse/UIMARCAUTH-336) Show  permissions for creating new authority record via UI.
- [UIMARCAUTH-295](https://issues.folio.org/browse/UIMARCAUTH-295) Add Search type dropdown to Advanced search modal.
- [UIMARCAUTH-363](https://issues.folio.org/browse/UIMARCAUTH-363) Counter values and options for "Authority source", "Thesaurus" facet options do not change when changing search parameters.
- [UIMARCAUTH-337](https://issues.folio.org/browse/UIMARCAUTH-337) Add `Manage authority files` settings.
- [UIMARCAUTH-360](https://issues.folio.org/browse/UIMARCAUTH-360) Implement creation of Authority Source Files.
- [UIMARCAUTH-374](https://issues.folio.org/browse/UIMARCAUTH-374) Use `onSave` prop for quickMARC to handle saving records separately.
- [UIMARCAUTH-369](https://issues.folio.org/browse/UIMARCAUTH-369) Add Create a new MARC authority record keyboard shortcut.
- [UIMARCAUTH-374](https://issues.folio.org/browse/UIMARCAUTH-382) Add the same permissions that are listed in `quickMARC: Create a new MARC authority record` to `Create new MARC authority record`.
- [UIMARCAUTH-359](https://issues.folio.org/browse/UIMARCAUTH-359) EDIT | Create new settings options for configuring authority files
- [UIMARCAUTH-361](https://issues.folio.org/browse/UIMARCAUTH-361) DELETE | Create new settings options for configuring authority files
- [UIMARCAUTH-368](https://issues.folio.org/browse/UIMARCAUTH-368) Add additional HRID validation for authority file settings.
- [UIMARCAUTH-376](https://issues.folio.org/browse/UIMARCAUTH-376) Validate if a prefix is an alphabetical value for authority file settings.
- [UIMARCAUTH-377](https://issues.folio.org/browse/UIMARCAUTH-377) Validate if the authority file name is unique for authority file settings.
- [UIMARCAUTH-370](https://issues.folio.org/browse/UIMARCAUTH-370) Add base url validation for authority file settings.
- [UIMARCAUTH-371](https://issues.folio.org/browse/UIMARCAUTH-371) MARC Authority app > Search and Browse Results > Update HTML page title with search term entered.

## [4.0.1](https://github.com/folio-org/ui-marc-authorities/tree/v4.0.1) (2023-11-29)

- [UIMARCAUTH-351](https://issues.folio.org/browse/UIMARCAUTH-351) Clear selected authority record data before opening another one.
- [UIMARCAUTH-353](https://issues.folio.org/browse/UIMARCAUTH-353) Use first page Browse query for facet requests
- [UIMARCAUTH-358](https://issues.folio.org/browse/UIMARCAUTH-358) Show the number of linked MARC bibs in delete confirmation modal when deleting non-authorized authority.

## [4.0.0](https://github.com/folio-org/ui-marc-authorities/tree/v4.0.0) (2023-10-13)

- [UIMARCAUTH-251](https://issues.folio.org/browse/UIMARCAUTH-251) Browse: Fix Space at the begining and end of query string
- [UIMARCAUTH-261](https://issues.folio.org/browse/UIMARCAUTH-261) Fix tests.
- [UIMARCAUTH-239](https://issues.folio.org/browse/UIMARCAUTH-239) Detail Record Actions dropdown menu > Add icons to the left of each action
- [UIMARCAUTH-253](https://issues.folio.org/browse/UIMARCAUTH-253) Avoid private paths in stripes-core imports.
- [UIMARCAUTH-260](https://issues.folio.org/browse/UIMARCAUTH-260) Added stripes-authority-components to stripesDeps.
- [UIMARCAUTH-212](https://issues.folio.org/browse/UIMARCAUTH-212) Global Headings Report | UX | Failed updates: linked bibliographic fields (CSV)
- [UIMARCAUTH-272](https://issues.folio.org/browse/UIMARCAUTH-272) Upgrade the records-editor.records interface.
- [UIMARCAUTH-273](https://issues.folio.org/browse/UIMARCAUTH-273) Added missing permission for editing MARC Authority records.
- [UIMARCAUTH-269](https://issues.folio.org/browse/UIMARCAUTH-269) "Month" dropdown is Not displayed in date picker element opened in modal window
- [UIMARCAUTH-264](https://issues.folio.org/browse/UIMARCAUTH-264) Retain `Search` and `Browse` search terms.
- [UIMARCAUTH-286](https://issues.folio.org/browse/UIMARCAUTH-286) Change records-editor.records interface name and permission names to marc-records-editor
- [UIMARCAUTH-288](https://issues.folio.org/browse/UIMARCAUTH-288) Add permission to "MARC Authority: View MARC authority record".
- [UIMARCAUTH-289](https://issues.folio.org/browse/UIMARCAUTH-289) New permission: MARC authority: Create MARC authority record.
- [UIMARCAUTH-290](https://issues.folio.org/browse/UIMARCAUTH-290) Create Orig Authority Record: Add MARC authority action.
- [UIMARCAUTH-291](https://issues.folio.org/browse/UIMARCAUTH-291) Update markHighlightedFields function with authority Mapping Rules. Added new permission to get mapping-rules.
- [UIMARCAUTH-300](https://issues.folio.org/browse/UIMARCAUTH-300) *BREAKING* Bump `react` to `v18`.
- [UIMARCAUTH-268](https://issues.folio.org/browse/UIMARCAUTH-268) Add "Local" or "Shared" to flag MARC authorities.
- [UIMARCAUTH-298](https://issues.folio.org/browse/UIMARCAUTH-298) Add Shared icon to MARC authority search results.
- [UIMARCAUTH-305](https://issues.folio.org/browse/UIMARCAUTH-305) Change tenant id to central when opening details of Shared Authority.
- [UIMARCAUTH-305](https://issues.folio.org/browse/UIMARCAUTH-302) Update Node.js to v18 in GitHub Actions.
- [UIMARCAUTH-317](https://issues.folio.org/browse/UIMARCAUTH-317) Add persmission 'link suggestions' to authority view.
- [UIMARCAUTH-284](https://issues.folio.org/browse/UIMARCAUTH-284) Delete Shared MARC authority record.
- [UIMARCAUTH-313](https://issues.folio.org/browse/UIMARCAUTH-313) Load MARC Authority source file with authority record's `tenantId`.
- [UIMARCAUTH-285](https://issues.folio.org/browse/UIMARCAUTH-285) Edit Shared MARC authority record, update Shared & Local Instances.
- [UIMARCAUTH-321](https://issues.folio.org/browse/UIMARCAUTH-321) *BREAKING* bump `react-intl` to `v6.4.4`.
- [UIMARCAUTH-297](https://issues.folio.org/browse/UIMARCAUTH-297) Don't clear previous Search/Browse results to highlight the edited record.
- [UIMARCAUTH-327](https://issues.folio.org/browse/UIMARCAUTH-327) Remove unnecessary pagingOffset prop.
- [UIMARCAUTH-314](https://issues.folio.org/browse/UIMARCAUTH-314) Hide permission `MARC Authority: Create new MARC authority record`.

## [3.0.2](https://github.com/folio-org/ui-marc-authorities/tree/v3.0.2) (2023-03-24)

- [UIMARCAUTH-243](https://issues.folio.org/browse/UIMARCAUTH-243) Removed `@folio/stripes-final-form` from peerDeps

## [3.0.1](https://github.com/folio-org/ui-marc-authorities/tree/v3.0.1) (2023-03-14)

- [UIMARCAUTH-240](https://issues.folio.org/browse/UIMARCAUTH-240) Incorrect "Job type",  "Output type", "Description" for headings updates report export job
- [UIMARCAUTH-245](https://issues.folio.org/browse/UIMARCAUTH-245) The date format becomes incorrect after clearing the Datepicker field
- [UIMARCAUTH-243](https://issues.folio.org/browse/UIMARCAUTH-243) Removed `@folio/stripes-final-form` from peerDeps

## [3.0.0](https://github.com/folio-org/ui-marc-authorities/tree/v3.0.0) (2023-02-24)

- [UIMARCAUTH-177](https://issues.folio.org/browse/UIMARCAUTH-177) MARC authority: Search Results/Browse List: Add a new column Number of titles
- [UIMARCAUTH-178](https://issues.folio.org/browse/UIMARCAUTH-178) MARC authority: Delete MARC authority record handling
- [UIMARCAUTH-222](https://issues.folio.org/browse/UIMARCAUTH-222) MARC Authority: Edit MARC authority record
- [UIMARCAUTH-223](https://issues.folio.org/browse/UIMARCAUTH-223) bump stripes to 8.0.0 for Orchid/2023-R1
- [UIMARCAUTH-220](https://issues.folio.org/browse/UIMARCAUTH-220) Any user assign the permission View Authority record permissions can export authority reports
- [UIMARCAUTH-224](https://issues.folio.org/browse/UIMARCAUTH-224) Remove unneeded `react-redux`
- [UIMARCAUTH-221](https://issues.folio.org/browse/UIMARCAUTH-221) Align the module with mod-search API breaking change
- [UIMARCAUTH-226](https://issues.folio.org/browse/UIMARCAUTH-226) Bump quick-marc to 6.0.0
- [UIMARCAUTH-208](https://issues.folio.org/browse/UIMARCAUTH-208) Global Heading Report | UX | MARC authority headings updates report
- [UIMARCAUTH-233](https://issues.folio.org/browse/UIMARCAUTH-233) MARC Authority | Print Source record
- [UIMARCAUTH-234](https://issues.folio.org/browse/UIMARCAUTH-234) Fix incorrect payload structure for Authorities updates export.
- [UIMARCAUTH-235](https://issues.folio.org/browse/UIMARCAUTH-235) Changed the print popup title with new requirements
- [UIMARCAUTH-238](https://issues.folio.org/browse/UIMARCAUTH-238) Date formats not localized in "Set date range for MARC authority headings updates (CSV) report" modal
- [UIMARCAUTH-231](https://issues.folio.org/browse/UIMARCAUTH-231) Remove 'Failed updates reports' option from Orchid release.
- [UIMARCAUTH-237](https://issues.folio.org/browse/UIMARCAUTH-237) Add instance-authority-links.authority-statistics.collection.get.
- [UIMARCAUTH-236](https://issues.folio.org/browse/UIMARCAUTH-236) Unpin `@vue/compiler-sfc` which no longer causes node conflict

## [2.0.1](https://github.com/folio-org/ui-marc-authorities/tree/v2.0.1) (2022-11-28)

- [UIMARCAUTH-199](https://issues.folio.org/browse/UIMARCAUTH-199) Loading Pane snapping out of resize cache.
- [UIMARCAUTH-204](https://issues.folio.org/browse/UIMARCAUTH-203) Error appears when the user executes search in "MARC Authority" app
- [UIMARCAUTH-180](https://issues.folio.org/browse/UIMARCAUTH-180) MARC authority app: Results List: Number of titles column > Link each number to return all bib records linked to the authority record

## [2.0.0](https://github.com/folio-org/ui-marc-authorities/tree/v2.0.0) (2022-10-26)

- [UIMARCAUTH-160](https://issues.folio.org/browse/UIMARCAUTH-160) components are incorrectly imported directly from stripes-* packages
- [UIMARCAUTH-167](https://issues.folio.org/browse/UIMARCAUTH-167) Scroll bars display at the second pane when they don't need
- [UIMARCAUTH-170](https://issues.folio.org/browse/UIMARCAUTH-170) Tweak the search and view authority components
- [UIMARCAUTH-182](https://issues.folio.org/browse/UIMARCAUTH-182) Add the Expand the Search & filter pane option
- [UIMARCAUTH-183](https://issues.folio.org/browse/UIMARCAUTH-183) Results List : Click Link icon/button to select a MARC authority record
- [UIMARCAUTH-186](https://issues.folio.org/browse/UIMARCAUTH-186) Browse | The counter of selected records for export doesn't display at pane header
- [UIMARCAUTH-187](https://issues.folio.org/browse/UIMARCAUTH-187) FE: MARC authority: Create an Authority source facet
- [UIMARCAUTH-188](https://issues.folio.org/browse/UIMARCAUTH-188) MARC Authorities app: Add a11y tests
- [UIMARCAUTH-188](https://issues.folio.org/browse/UIMARCAUTH-191) MARC authority app: Authority source/Thesaurus Facet option does not display value when zero results are returned

## [1.1.2](https://github.com/folio-org/ui-marc-authorities/tree/v1.1.2) (2022-09-14)

- [UIMARCAUTH-169](https://issues.folio.org/browse/UIMARCAUTH-169) The counters at Browse authority pane and "Type of heading" facet options don't match
- [UIMARCAUTH-172](https://issues.folio.org/browse/UIMARCAUTH-172) Delete confirmation modal: Delete button does not display label

## [1.1.1](https://github.com/folio-org/ui-marc-authorities/tree/v1.1.1) (2022-08-04)

- [UIMARCAUTH-162](https://issues.folio.org/browse/UIMARCAUTH-162) Browse authority | Remove checkbox "Exclude see from also" from "Reference" accordion.
- [UIMARCAUTH-163](https://issues.folio.org/browse/UIMARCAUTH-163) Fix the row with "Heading/reference" value doesn't highlight at result list after editing matched tags value more than 1 time

## [1.1.0](https://github.com/folio-org/ui-marc-authorities/tree/v1.1.0) (2022-07-08)

- [UIMARCAUTH-86](https://issues.folio.org/browse/UIMARCAUTH-86) Change Browse option default selection label and behavior.
- [UIMARCAUTH-75](https://issues.folio.org/browse/UIMARCAUTH-75) Searching MARC authority records: Split up Exclude See from filters into two filters.
- [UIMARCAUTH-110](https://issues.folio.org/browse/UIMARCAUTH-110) When searching Identifier (all) search option Then only return results with Authorized/Reference type = Authorized.
- [UIMARCAUTH-111](https://issues.folio.org/browse/UIMARCAUTH-111) If only one result is returned then automatically display detail record.
- [UIMARCAUTH-67](https://issues.folio.org/browse/UIMARCAUTH-67) Permission: Delete MARC authority record.
- [UIMARCAUTH-88](https://issues.folio.org/browse/UIMARCAUTH-88) Browse authorities: Add Heading type facet.
- [UIMARCAUTH-64](https://issues.folio.org/browse/UIMARCAUTH-64) Add DELETE action for individual MARC Authority records.
- [UIMARCAUTH-119](https://issues.folio.org/browse/UIMARCAUTH-119) Browse "Enter" run search when placeholder "Select a browse option" active.
- [UIMARCAUTH-117](https://issues.folio.org/browse/UIMARCAUTH-117) Resetting sort of search result list after editing "MARC Authority" record.
- [UIMARCAUTH-123](https://issues.folio.org/browse/UIMARCAUTH-123) Fix losing third pane after search and editing first result.
- [UIMARCAUTH-125](https://issues.folio.org/browse/UIMARCAUTH-125) Replace `babel-eslint` with `@babel/eslint-parser`.
- [UIMARCAUTH-120](https://issues.folio.org/browse/UIMARCAUTH-120) Allow user to select MARC authority record(s) to export.
- [UIMARCAUTH-132](https://issues.folio.org/browse/UIMARCAUTH-132) Apply to MARC Authority: Optimistic locking: display error message to inform user about OL.
- [UIMARCAUTH-118](https://issues.folio.org/browse/UIMARCAUTH-118) Highlighting the row with "Heading/reference" value at result list after editing of record
- [UIMARCAUTH-135](https://issues.folio.org/browse/UIMARCAUTH-135) The search result list doesn't sort by clicking on the title of column
- [UIMARCAUTH-130](https://issues.folio.org/browse/UIMARCAUTH-130) Add a Select all/Un-select all on Results List
- [UIMARCAUTH-121](https://issues.folio.org/browse/UIMARCAUTH-121) Export .csv file to load to Data export to create the .mrc file of selected authority records
- [FOLIO-3477](https://issues.folio.org/browse/FOLIO-3477) FE: update outdated dependencies.
- [UIMARCAUTH-143](https://issues.folio.org/browse/UIMARCAUTH-143) FE: Update Personal name, Corporate/Conference name and Corporate name Search/Browse options
- [UIMARCAUTH-147](https://issues.folio.org/browse/UIMARCAUTH-147) Fix history push to support code splitting.
- Pin @vue/compiler-sfc to fix formatjs-compile errors
- [UIMARCAUTH-146](https://issues.folio.org/browse/UIMARCAUTH-146) Export ".csv" file failed because of missing permission
- [UIMARCAUTH-144](https://issues.folio.org/browse/UIMARCAUTH-144) Deleted "MARC Authority" records display at result list
- [UIMARCAUTH-151](https://issues.folio.org/browse/UIMARCAUTH-151) Change request param headingTypeExt to isTitleHeadingRef
- [UIMARCAUTH-140](https://issues.folio.org/browse/UIMARCAUTH-140) [Browse] The page without results is displayed when user go to the last page of result list.
- [UIMARCAUTH-145](https://issues.folio.org/browse/UIMARCAUTH-145) FE: update outdated dependencies
- [UIMARCAUTH-153](https://issues.folio.org/browse/UIMARCAUTH-153) SelectAll/UnSelectAll checkbox functionality is buggy when placeholder row and pagination exists
- [UIMARCAUTH-149](https://issues.folio.org/browse/UIMARCAUTH-149) Update NodeJS to v16 in GitHub Actions.
- [UIMARCAUTH-152](https://issues.folio.org/browse/UIMARCAUTH-152) An error appears when user tries to close the editing window of already deleted "MARC Authority" record.

## [1.0.5](https://github.com/folio-org/ui-marc-authorities/tree/v1.0.5) (2022-04-15)

- [UIMARCAUTH-122](https://issues.folio.org/browse/UIMARCAUTH-122) Correctly allow horizontal scrolling in details pane.

## [1.0.4](https://github.com/folio-org/ui-marc-authorities/tree/v1.0.4) (2022-04-08)

- [UIMARCAUTH-114](https://issues.folio.org/browse/UIMARCAUTH-114) Search for MARC Authority record with " & " special character in title - returns no results.
- [UIMARCAUTH-115](https://issues.folio.org/browse/UIMARCAUTH-115) Updated Heading and Reference is not displayed on results list.

## [1.0.3](https://github.com/folio-org/ui-marc-authorities/tree/v1.0.3) (2022-03-30)

- [UIMARCAUTH-89](https://issues.folio.org/browse/UIMARCAUTH-89) Browse option selection searches all.
- [UIMARCAUTH-96](https://issues.folio.org/browse/UIMARCAUTH-96) The 6th result of browse authority record is not highlighting in bold.
- [UIMARCAUTH-97](https://issues.folio.org/browse/UIMARCAUTH-97) The selected Heading/Reference value does not match the value highlighted in the detail record.
- [UIMARCAUTH-74](https://issues.folio.org/browse/UIMARCAUTH-74) Advanced search does not work when editing Advanced Search box.
- [UIMARCAUTH-86](https://issues.folio.org/browse/UIMARCAUTH-86) Change Browse option default selection label and behavior.
- [UIMARCAUTH-92](https://issues.folio.org/browse/UIMARCAUTH-92) Change MARC Authority in universal header Apps dropdown and app context menu dropdown.

## [1.0.2](https://github.com/folio-org/ui-marc-authorities/tree/v1.0.2) (2022-03-29)

- [UIMARCAUTH-108](https://issues.folio.org/browse/UIMARCAUTH-108) Cannot assign MARC authority permissions only.
- [UIMARCAUTH-100](https://issues.folio.org/browse/UIMARCAUTH-100) Fix tag value which contains part of authority heading ref value gets highlighted at record detail view.
- [UIMARCAUTH-112](https://issues.folio.org/browse/UIMARCAUTH-112) Renamed accordion label and facet label from Subject heading/thesaurus facet to Thesaurus facet

## [1.0.0](https://github.com/folio-org/ui-marc-authorities/tree/v1.0.0) (2022-03-10)

- [UIMARCAUTH-6](https://issues.folio.org/browse/UIMARCAUTH-6) Add View MARC authority record permission.
- [UIMARCAUTH-5](https://issues.folio.org/browse/UIMARCAUTH-5) Add Edit MARC authority record permission.
- [UIMARCAUTH-18](https://issues.folio.org/browse/UIMARCAUTH-18) Display Results List.
- [UIMARCAUTH-16](https://issues.folio.org/browse/UIMARCAUTH-16) Implement MARC Authorities Search Box.
- [UIMARCAUTH-3](https://issues.folio.org/browse/UIMARCAUTH-3) Add View MARC authority record in MARC Authorities App.
- [UIMARCAUTH-20](https://issues.folio.org/browse/UIMARCAUTH-20) Implement Results List Column Chooser.
- [UIMARCAUTH-15](https://issues.folio.org/browse/UIMARCAUTH-15) Display a Date Updated filter.
- [UIMARCAUTH-14](https://issues.folio.org/browse/UIMARCAUTH-14) Display a Date Created filter.
- [UIMARCAUTH-31](https://issues.folio.org/browse/UIMARCAUTH-31) Fix formatting of search query string.
- [UIMARCAUTH-24](https://issues.folio.org/browse/UIMARCAUTH-24) Add support for Facet: Type of heading.
- [UIMARCAUTH-19](https://issues.folio.org/browse/UIMARCAUTH-19) Implement Results List Sort options.
- [UIMARCAUTH-17](https://issues.folio.org/browse/UIMARCAUTH-17) Display a Exclude see from limiter.
- [UIMARCAUTH-40](https://issues.folio.org/browse/UIMARCAUTH-40) Fix Results List column headers are smushed.
- [UIMARCAUTH-34](https://issues.folio.org/browse/UIMARCAUTH-34) Remove Authority UUID search option.
- [UIMARCAUTH-32](https://issues.folio.org/browse/UIMARCAUTH-32) Search box - Hit enter key must run search.
- [UIMARCAUTH-36](https://issues.folio.org/browse/UIMARCAUTH-36) Update second line heading on QuickMarc view pane.
- [UIMARCAUTH-45](https://issues.folio.org/browse/UIMARCAUTH-45) Add Edit button on MarcView Pane.
- [UIMARCAUTH-46](https://issues.folio.org/browse/UIMARCAUTH-46) Fix Cannot get Authority record search - Identifiers search option to work.
- [UIMARCAUTH-37](https://issues.folio.org/browse/UIMARCAUTH-37) Fix Closing third pane does not resize the second pane size and Reset all does not reset results list pane.
- [UIMARCAUTH-30](https://issues.folio.org/browse/UIMARCAUTH-30) Implement App context menu and keyboard shortcuts.
- [UIMARCAUTH-48](https://issues.folio.org/browse/UIMARCAUTH-48) Children's subject headings search option - Extend request by searching by subjectHeadings = b.
- [UIMARCAUTH-50](https://issues.folio.org/browse/UIMARCAUTH-50) Do not bold Auth/Ref in Authorized/Reference column.
- [UIMARCAUTH-28](https://issues.folio.org/browse/UIMARCAUTH-28) Browse MARC Authority Records > Display Browse headings toggle.
- [UIMARCAUTH-52](https://issues.folio.org/browse/UIMARCAUTH-52) Update Keyword Search query to apply Exclude see also filter selection.
- [UIMARCAUTH-60](https://issues.folio.org/browse/UIMARCAUTH-60) MARC authority record displays two different Last updated dates.
- [UIMARCAUTH-58](https://issues.folio.org/browse/UIMARCAUTH-58) Request for Facets fails - missing permissions.
- [UIMARCAUTH-57](https://issues.folio.org/browse/UIMARCAUTH-57) Fix cannot search by identifiers that contain a space.
- [UIMARCAUTH-61](https://issues.folio.org/browse/UIMARCAUTH-61) Fix three pane view is not retained when you hit Edit and then click "X" or Cancel button.
- [UIMARCAUTH-73](https://issues.folio.org/browse/UIMARCAUTH-73) Update Authority Search Options - Corporate/Conference Name & Personal Name.
- [UIMARCAUTH-76](https://issues.folio.org/browse/UIMARCAUTH-76) Change query in Geographic name search option
- [UIMARCAUTH-70](https://issues.folio.org/browse/UIMARCAUTH-70) Clicking on Result in Results list should highlight the selected row.
- [UIMARCAUTH-83](https://issues.folio.org/browse/UIMARCAUTH-83) Browse Authorities: Better handling for when there is no exact match.
- [UIMARCAUTH-62](https://issues.folio.org/browse/UIMARCAUTH-62) Create a Subject heading/thesaurus facet.
- [UIMARCAUTH-72](https://issues.folio.org/browse/UIMARCAUTH-72) Update Authority Browse Options.

## [0.1.0](https://github.com/folio-org/ui-marc-authorities/tree/v0.1.0) (2021-01-20)

- New app created with stripes-cli
