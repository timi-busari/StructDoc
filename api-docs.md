# API Documentation

Auto-generated API documentation from NestJS codebase.

*Generated on: 2/4/2026, 2:16:59 PM*

## Table of Contents

- [CompanyMigrationController](#companymigrationcontroller)
  - [GET /internal/company-migration/internal/company-migration/company/:companyId/summary](#get--internal-company-migration-internal-company-migration-company--companyid-summary)
  - [POST /internal/company-migration/internal/company-migration/update-company-id](#post--internal-company-migration-internal-company-migration-update-company-id)
- [MobileHodScheduleController](#mobilehodschedulecontroller)
  - [GET /mobile/hod/schedules/mobile/hod/schedules](#get--mobile-hod-schedules-mobile-hod-schedules)
  - [POST /mobile/hod/schedules/mobile/hod/schedules](#post--mobile-hod-schedules-mobile-hod-schedules)
  - [GET /mobile/hod/schedules/mobile/hod/schedules/:scheduleId](#get--mobile-hod-schedules-mobile-hod-schedules--scheduleid)
  - [PUT /mobile/hod/schedules/mobile/hod/schedules/:scheduleId/attach-employees](#put--mobile-hod-schedules-mobile-hod-schedules--scheduleid-attach-employees)
  - [GET /mobile/hod/schedules/mobile/hod/schedules/:scheduleId/employees](#get--mobile-hod-schedules-mobile-hod-schedules--scheduleid-employees)
  - [PUT /mobile/hod/schedules/mobile/hod/schedules/:scheduleId/status](#put--mobile-hod-schedules-mobile-hod-schedules--scheduleid-status)
- [MobileManagerScheduleController](#mobilemanagerschedulecontroller)
  - [GET /mobile/manager/schedules/mobile/manager/schedules](#get--mobile-manager-schedules-mobile-manager-schedules)
  - [POST /mobile/manager/schedules/mobile/manager/schedules](#post--mobile-manager-schedules-mobile-manager-schedules)
  - [GET /mobile/manager/schedules/mobile/manager/schedules/:scheduleId](#get--mobile-manager-schedules-mobile-manager-schedules--scheduleid)
  - [PUT /mobile/manager/schedules/mobile/manager/schedules/:scheduleId/attach-employees](#put--mobile-manager-schedules-mobile-manager-schedules--scheduleid-attach-employees)
  - [GET /mobile/manager/schedules/mobile/manager/schedules/:scheduleId/employees](#get--mobile-manager-schedules-mobile-manager-schedules--scheduleid-employees)
  - [PUT /mobile/manager/schedules/mobile/manager/schedules/:scheduleId/status](#put--mobile-manager-schedules-mobile-manager-schedules--scheduleid-status)
- [MobileScheduleManagerController](#mobileschedulemanagercontroller)
  - [GET /mobile/schedule-managers/mobile/schedule-managers/:scheduleId/employees](#get--mobile-schedule-managers-mobile-schedule-managers--scheduleid-employees)
  - [GET /mobile/schedule-managers/mobile/schedule-managers/day-schedule](#get--mobile-schedule-managers-mobile-schedule-managers-day-schedule)
  - [GET /mobile/schedule-managers/mobile/schedule-managers/employee-schedules](#get--mobile-schedule-managers-mobile-schedule-managers-employee-schedules)
  - [GET /mobile/schedule-managers/mobile/schedule-managers/my-schedule](#get--mobile-schedule-managers-mobile-schedule-managers-my-schedule)
  - [GET /mobile/schedule-managers/mobile/schedule-managers/schedule/:scheduleId/details](#get--mobile-schedule-managers-mobile-schedule-managers-schedule--scheduleid-details)
  - [GET /mobile/schedule-managers/mobile/schedule-managers/shift-plan/:scheduleId/employee](#get--mobile-schedule-managers-mobile-schedule-managers-shift-plan--scheduleid-employee)
  - [GET /mobile/schedule-managers/mobile/schedule-managers/shift-plan/:scheduleId/employees](#get--mobile-schedule-managers-mobile-schedule-managers-shift-plan--scheduleid-employees)
  - [GET /mobile/schedule-managers/mobile/schedule-managers/shift-plan/:scheduleId/user/:userId](#get--mobile-schedule-managers-mobile-schedule-managers-shift-plan--scheduleid-user--userid)
- [ScheduleController](#schedulecontroller)
  - [POST /admin/schedules/admin/schedules](#post--admin-schedules-admin-schedules)
  - [GET /admin/schedules/admin/schedules](#get--admin-schedules-admin-schedules)
  - [GET /admin/schedules/admin/schedules/:scheduleId](#get--admin-schedules-admin-schedules--scheduleid)
  - [PUT /admin/schedules/admin/schedules/:scheduleId](#put--admin-schedules-admin-schedules--scheduleid)
  - [PUT /admin/schedules/admin/schedules/:scheduleId/attach-employees](#put--admin-schedules-admin-schedules--scheduleid-attach-employees)
  - [GET /admin/schedules/admin/schedules/:scheduleId/attached-employees](#get--admin-schedules-admin-schedules--scheduleid-attached-employees)
  - [PUT /admin/schedules/admin/schedules/:scheduleId/detach/employees](#put--admin-schedules-admin-schedules--scheduleid-detach-employees)
  - [PUT /admin/schedules/admin/schedules/:scheduleId/detach/inactive-employees](#put--admin-schedules-admin-schedules--scheduleid-detach-inactive-employees)
  - [PUT /admin/schedules/admin/schedules/:scheduleId/detach/schedule-employees](#put--admin-schedules-admin-schedules--scheduleid-detach-schedule-employees)
  - [GET /admin/schedules/admin/schedules/:scheduleId/employee-conflicts](#get--admin-schedules-admin-schedules--scheduleid-employee-conflicts)
  - [GET /admin/schedules/admin/schedules/:scheduleId/employees](#get--admin-schedules-admin-schedules--scheduleid-employees)
  - [POST /admin/schedules/admin/schedules/:scheduleId/employees](#post--admin-schedules-admin-schedules--scheduleid-employees)
  - [GET /admin/schedules/admin/schedules/:scheduleId/employees/inactive](#get--admin-schedules-admin-schedules--scheduleid-employees-inactive)
  - [GET /admin/schedules/admin/schedules/:scheduleId/shift-plan-details](#get--admin-schedules-admin-schedules--scheduleid-shift-plan-details)
  - [GET /admin/schedules/admin/schedules/:scheduleId/shift-plans](#get--admin-schedules-admin-schedules--scheduleid-shift-plans)
  - [POST /admin/schedules/admin/schedules/:scheduleId/shift-plans](#post--admin-schedules-admin-schedules--scheduleid-shift-plans)
  - [DELETE /admin/schedules/admin/schedules/:scheduleId/shift-plans/:shiftPlanId](#delete--admin-schedules-admin-schedules--scheduleid-shift-plans--shiftplanid)
  - [GET /admin/schedules/admin/schedules/:scheduleId/shift-plans/aggregate](#get--admin-schedules-admin-schedules--scheduleid-shift-plans-aggregate)
  - [PUT /admin/schedules/admin/schedules/:scheduleId/status](#put--admin-schedules-admin-schedules--scheduleid-status)
  - [GET /admin/schedules/admin/schedules/:scheduleId/time-blocks](#get--admin-schedules-admin-schedules--scheduleid-time-blocks)
  - [POST /admin/schedules/admin/schedules/:scheduleId/time-blocks/attach](#post--admin-schedules-admin-schedules--scheduleid-time-blocks-attach)
  - [GET /admin/schedules/admin/schedules/employee-code/download](#get--admin-schedules-admin-schedules-employee-code-download)
  - [GET /admin/schedules/admin/schedules/employee/:employeeId/monthly-schedule](#get--admin-schedules-admin-schedules-employee--employeeid-monthly-schedule)
  - [GET /admin/schedules/admin/schedules/employee/:employeeId/monthly-schedule/export](#get--admin-schedules-admin-schedules-employee--employeeid-monthly-schedule-export)
  - [GET /admin/schedules/admin/schedules/employee/:employeeId/schedule-details](#get--admin-schedules-admin-schedules-employee--employeeid-schedule-details)
  - [POST /admin/schedules/admin/schedules/employee/upload/:scheduleId](#post--admin-schedules-admin-schedules-employee-upload--scheduleid)
  - [GET /admin/schedules/admin/schedules/employees/with-or-without-schedule](#get--admin-schedules-admin-schedules-employees-with-or-without-schedule)
  - [GET /admin/schedules/admin/schedules/employees/with-or-without-schedule/export](#get--admin-schedules-admin-schedules-employees-with-or-without-schedule-export)
  - [GET /admin/schedules/admin/schedules/hrms-schedules](#get--admin-schedules-admin-schedules-hrms-schedules)
  - [POST /admin/schedules/admin/schedules/hrms-schedules/migrate](#post--admin-schedules-admin-schedules-hrms-schedules-migrate)
  - [GET /admin/schedules/admin/schedules/policy/:policyId](#get--admin-schedules-admin-schedules-policy--policyid)
- [ScheduleController](#schedulecontroller)
  - [GET /schedules/schedules/:scheduleId/group-employees](#get--schedules-schedules--scheduleid-group-employees)
- [ScheduleManagementController](#schedulemanagementcontroller)
  - [POST /internal/schedules/internal/schedules/:companyId](#post--internal-schedules-internal-schedules--companyid)
  - [GET /internal/schedules/internal/schedules/:companyId/day](#get--internal-schedules-internal-schedules--companyid-day)
  - [GET /internal/schedules/internal/schedules/:companyId/employees](#get--internal-schedules-internal-schedules--companyid-employees)
  - [GET /internal/schedules/internal/schedules/:companyId/employees/count](#get--internal-schedules-internal-schedules--companyid-employees-count)
  - [GET /internal/schedules/internal/schedules/:companyId/list](#get--internal-schedules-internal-schedules--companyid-list)
  - [GET /internal/schedules/internal/schedules/:entity-mapping](#get--internal-schedules-internal-schedules--entity-mapping)
  - [GET /internal/schedules/internal/schedules/:scheduleId](#get--internal-schedules-internal-schedules--scheduleid)
  - [GET /internal/schedules/internal/schedules/:scheduleId/employees/:companyId](#get--internal-schedules-internal-schedules--scheduleid-employees--companyid)
  - [GET /internal/schedules/internal/schedules/:scheduleId/policies](#get--internal-schedules-internal-schedules--scheduleid-policies)
  - [POST /internal/schedules/internal/schedules/:scheduleId/unpublish-remove-employees/:companyId](#post--internal-schedules-internal-schedules--scheduleid-unpublish-remove-employees--companyid)
  - [DELETE /internal/schedules/internal/schedules/delete-schedule/:scheduleId](#delete--internal-schedules-internal-schedules-delete-schedule--scheduleid)
  - [POST /internal/schedules/internal/schedules/employee-details/:companyId](#post--internal-schedules-internal-schedules-employee-details--companyid)
  - [GET /internal/schedules/internal/schedules/employee-schedules](#get--internal-schedules-internal-schedules-employee-schedules)
  - [GET /internal/schedules/internal/schedules/employee/:employeeId](#get--internal-schedules-internal-schedules-employee--employeeid)
  - [GET /internal/schedules/internal/schedules/employee/resolve](#get--internal-schedules-internal-schedules-employee-resolve)
  - [POST /internal/schedules/internal/schedules/employees](#post--internal-schedules-internal-schedules-employees)
  - [POST /internal/schedules/internal/schedules/employees-in-schedule/:companyId](#post--internal-schedules-internal-schedules-employees-in-schedule--companyid)
  - [GET /internal/schedules/internal/schedules/ended-schedules/:companyId](#get--internal-schedules-internal-schedules-ended-schedules--companyid)
  - [POST /internal/schedules/internal/schedules/holiday-sync/:companyId](#post--internal-schedules-internal-schedules-holiday-sync--companyid)
  - [POST /internal/schedules/internal/schedules/leave-attendance-sync/:companyId](#post--internal-schedules-internal-schedules-leave-attendance-sync--companyid)
  - [GET /internal/schedules/internal/schedules/mark-past-date-absent/:companyId/:date](#get--internal-schedules-internal-schedules-mark-past-date-absent--companyid--date)
  - [POST /internal/schedules/internal/schedules/policy/:policyId/detach](#post--internal-schedules-internal-schedules-policy--policyid-detach)
  - [GET /internal/schedules/internal/schedules/policy/:policyId/in-use](#get--internal-schedules-internal-schedules-policy--policyid-in-use)
  - [GET /internal/schedules/internal/schedules/prefill-attendance-records/:companyId/:date](#get--internal-schedules-internal-schedules-prefill-attendance-records--companyid--date)
  - [POST /internal/schedules/internal/schedules/remove-employees/:companyId](#post--internal-schedules-internal-schedules-remove-employees--companyid)
  - [GET /internal/schedules/internal/schedules/resolve/employees/:companyId/:day](#get--internal-schedules-internal-schedules-resolve-employees--companyid--day)
  - [GET /internal/schedules/internal/schedules/schedule-deletion-details/:scheduleId](#get--internal-schedules-internal-schedules-schedule-deletion-details--scheduleid)
  - [GET /internal/schedules/internal/schedules/settings/:companyId](#get--internal-schedules-internal-schedules-settings--companyid)
- [ScheduleManagerController](#schedulemanagercontroller)
  - [GET /ess/schedule-managers/ess/schedule-managers/day-schedule](#get--ess-schedule-managers-ess-schedule-managers-day-schedule)
  - [GET /ess/schedule-managers/ess/schedule-managers/month-schedule](#get--ess-schedule-managers-ess-schedule-managers-month-schedule)
  - [GET /ess/schedule-managers/ess/schedule-managers/my-schedule](#get--ess-schedule-managers-ess-schedule-managers-my-schedule)
  - [GET /ess/schedule-managers/ess/schedule-managers/shift-plan/:scheduleId/employee](#get--ess-schedule-managers-ess-schedule-managers-shift-plan--scheduleid-employee)
  - [GET /ess/schedule-managers/ess/schedule-managers/shift-plan/:scheduleId/employees](#get--ess-schedule-managers-ess-schedule-managers-shift-plan--scheduleid-employees)
  - [GET /ess/schedule-managers/ess/schedule-managers/shift-plan/:scheduleId/user/:userId](#get--ess-schedule-managers-ess-schedule-managers-shift-plan--scheduleid-user--userid)
  - [GET /ess/schedule-managers/ess/schedule-managers/week-schedule](#get--ess-schedule-managers-ess-schedule-managers-week-schedule)
- [ScheduleManagerController](#schedulemanagercontroller)
  - [POST /hod/schedules/hod/schedules](#post--hod-schedules-hod-schedules)
  - [GET /hod/schedules/hod/schedules](#get--hod-schedules-hod-schedules)
  - [PUT /hod/schedules/hod/schedules/:scheduleId](#put--hod-schedules-hod-schedules--scheduleid)
  - [GET /hod/schedules/hod/schedules/:scheduleId/attached-employees](#get--hod-schedules-hod-schedules--scheduleid-attached-employees)
  - [PUT /hod/schedules/hod/schedules/:scheduleId/detach/inactive-employees](#put--hod-schedules-hod-schedules--scheduleid-detach-inactive-employees)
  - [POST /hod/schedules/hod/schedules/:scheduleId/employees](#post--hod-schedules-hod-schedules--scheduleid-employees)
  - [GET /hod/schedules/hod/schedules/:scheduleId/employees](#get--hod-schedules-hod-schedules--scheduleid-employees)
  - [GET /hod/schedules/hod/schedules/:scheduleId/employees/inactive](#get--hod-schedules-hod-schedules--scheduleid-employees-inactive)
  - [GET /hod/schedules/hod/schedules/:scheduleId/shift-plan-details](#get--hod-schedules-hod-schedules--scheduleid-shift-plan-details)
  - [GET /hod/schedules/hod/schedules/:scheduleId/shift-plans](#get--hod-schedules-hod-schedules--scheduleid-shift-plans)
  - [POST /hod/schedules/hod/schedules/:scheduleId/shift-plans](#post--hod-schedules-hod-schedules--scheduleid-shift-plans)
  - [GET /hod/schedules/hod/schedules/employee/:employeeId/monthly-schedule/export](#get--hod-schedules-hod-schedules-employee--employeeid-monthly-schedule-export)
  - [GET /hod/schedules/hod/schedules/employee/:employeeId/schedule-details](#get--hod-schedules-hod-schedules-employee--employeeid-schedule-details)
  - [POST /hod/schedules/hod/schedules/employee/upload/:scheduleId](#post--hod-schedules-hod-schedules-employee-upload--scheduleid)
  - [GET /hod/schedules/hod/schedules/employees/with-or-without-schedule](#get--hod-schedules-hod-schedules-employees-with-or-without-schedule)
  - [GET /hod/schedules/hod/schedules/employees/with-or-without-schedule/export](#get--hod-schedules-hod-schedules-employees-with-or-without-schedule-export)
- [ScheduleManagerController](#schedulemanagercontroller)
  - [POST /manager/schedules/manager/schedules](#post--manager-schedules-manager-schedules)
  - [GET /manager/schedules/manager/schedules](#get--manager-schedules-manager-schedules)
  - [PUT /manager/schedules/manager/schedules/:scheduleId](#put--manager-schedules-manager-schedules--scheduleid)
  - [GET /manager/schedules/manager/schedules/:scheduleId/attached-employees](#get--manager-schedules-manager-schedules--scheduleid-attached-employees)
  - [PUT /manager/schedules/manager/schedules/:scheduleId/detach/inactive-employees](#put--manager-schedules-manager-schedules--scheduleid-detach-inactive-employees)
  - [POST /manager/schedules/manager/schedules/:scheduleId/employees](#post--manager-schedules-manager-schedules--scheduleid-employees)
  - [GET /manager/schedules/manager/schedules/:scheduleId/employees](#get--manager-schedules-manager-schedules--scheduleid-employees)
  - [GET /manager/schedules/manager/schedules/:scheduleId/employees/inactive](#get--manager-schedules-manager-schedules--scheduleid-employees-inactive)
  - [GET /manager/schedules/manager/schedules/:scheduleId/shift-plan-details](#get--manager-schedules-manager-schedules--scheduleid-shift-plan-details)
  - [GET /manager/schedules/manager/schedules/:scheduleId/shift-plans](#get--manager-schedules-manager-schedules--scheduleid-shift-plans)
  - [POST /manager/schedules/manager/schedules/:scheduleId/shift-plans](#post--manager-schedules-manager-schedules--scheduleid-shift-plans)
  - [GET /manager/schedules/manager/schedules/employee/:employeeId/monthly-schedule/export](#get--manager-schedules-manager-schedules-employee--employeeid-monthly-schedule-export)
  - [GET /manager/schedules/manager/schedules/employee/:employeeId/schedule-details](#get--manager-schedules-manager-schedules-employee--employeeid-schedule-details)
  - [POST /manager/schedules/manager/schedules/employee/upload/:scheduleId](#post--manager-schedules-manager-schedules-employee-upload--scheduleid)
  - [GET /manager/schedules/manager/schedules/employees/with-or-without-schedule](#get--manager-schedules-manager-schedules-employees-with-or-without-schedule)
  - [GET /manager/schedules/manager/schedules/employees/with-or-without-schedule/export](#get--manager-schedules-manager-schedules-employees-with-or-without-schedule-export)
- [SharedController](#sharedcontroller)
  - [POST /shared/shared/leave-days](#post--shared-shared-leave-days)
  - [GET /shared/shared/leave-days](#get--shared-shared-leave-days)
- [ShiftPlanController](#shiftplancontroller)
  - [GET /admin/shift-plans/admin/shift-plans](#get--admin-shift-plans-admin-shift-plans)
  - [GET /admin/shift-plans/admin/shift-plans/:scheduleId/employee](#get--admin-shift-plans-admin-shift-plans--scheduleid-employee)
  - [GET /admin/shift-plans/admin/shift-plans/:scheduleId/employees](#get--admin-shift-plans-admin-shift-plans--scheduleid-employees)
  - [PATCH /admin/shift-plans/admin/shift-plans/:shiftPlanId](#patch--admin-shift-plans-admin-shift-plans--shiftplanid)
  - [DELETE /admin/shift-plans/admin/shift-plans/:shiftPlanId](#delete--admin-shift-plans-admin-shift-plans--shiftplanid)
  - [GET /admin/shift-plans/admin/shift-plans/:shiftPlanId](#get--admin-shift-plans-admin-shift-plans--shiftplanid)
  - [GET /admin/shift-plans/admin/shift-plans/:shiftPlanId/details](#get--admin-shift-plans-admin-shift-plans--shiftplanid-details)
  - [POST /admin/shift-plans/admin/shift-plans/:shiftPlanId/details](#post--admin-shift-plans-admin-shift-plans--shiftplanid-details)
  - [PUT /admin/shift-plans/admin/shift-plans/:shiftPlanId/details](#put--admin-shift-plans-admin-shift-plans--shiftplanid-details)
  - [POST /admin/shift-plans/admin/shift-plans/:shiftPlanId/dynamic-time-block-upload](#post--admin-shift-plans-admin-shift-plans--shiftplanid-dynamic-time-block-upload)
  - [POST /admin/shift-plans/admin/shift-plans/:shiftPlanId/time-block-upload](#post--admin-shift-plans-admin-shift-plans--shiftplanid-time-block-upload)
  - [GET /admin/shift-plans/admin/shift-plans/:shiftPlanId/time-blocks](#get--admin-shift-plans-admin-shift-plans--shiftplanid-time-blocks)
  - [POST /admin/shift-plans/admin/shift-plans/:shiftPlanId/upload](#post--admin-shift-plans-admin-shift-plans--shiftplanid-upload)
  - [GET /admin/shift-plans/admin/shift-plans/download](#get--admin-shift-plans-admin-shift-plans-download)
  - [GET /admin/shift-plans/admin/shift-plans/employees/attached-shiftplans](#get--admin-shift-plans-admin-shift-plans-employees-attached-shiftplans)
  - [GET /admin/shift-plans/admin/shift-plans/timeBlock/download](#get--admin-shift-plans-admin-shift-plans-timeblock-download)
- [ShiftPlanController](#shiftplancontroller)
  - [GET /hod/shift-plan/hod/shift-plan/:scheduleId/employees](#get--hod-shift-plan-hod-shift-plan--scheduleid-employees)
  - [PATCH /hod/shift-plan/hod/shift-plan/:shiftPlanId](#patch--hod-shift-plan-hod-shift-plan--shiftplanid)
  - [GET /hod/shift-plan/hod/shift-plan/:shiftPlanId/details](#get--hod-shift-plan-hod-shift-plan--shiftplanid-details)
  - [POST /hod/shift-plan/hod/shift-plan/:shiftPlanId/details](#post--hod-shift-plan-hod-shift-plan--shiftplanid-details)
  - [GET /hod/shift-plan/hod/shift-plan/:shiftPlanId/download](#get--hod-shift-plan-hod-shift-plan--shiftplanid-download)
  - [POST /hod/shift-plan/hod/shift-plan/:shiftPlanId/dynamic-time-block-upload](#post--hod-shift-plan-hod-shift-plan--shiftplanid-dynamic-time-block-upload)
  - [POST /hod/shift-plan/hod/shift-plan/:shiftPlanId/time-block-upload](#post--hod-shift-plan-hod-shift-plan--shiftplanid-time-block-upload)
  - [POST /hod/shift-plan/hod/shift-plan/:shiftPlanId/upload](#post--hod-shift-plan-hod-shift-plan--shiftplanid-upload)
  - [GET /hod/shift-plan/hod/shift-plan/employees/attached-shiftplans](#get--hod-shift-plan-hod-shift-plan-employees-attached-shiftplans)
  - [GET /hod/shift-plan/hod/shift-plan/timeBlock/download](#get--hod-shift-plan-hod-shift-plan-timeblock-download)
- [ShiftPlanController](#shiftplancontroller)
  - [GET /manager/shift-plan/manager/shift-plan/:scheduleId/employees](#get--manager-shift-plan-manager-shift-plan--scheduleid-employees)
  - [PATCH /manager/shift-plan/manager/shift-plan/:shiftPlanId](#patch--manager-shift-plan-manager-shift-plan--shiftplanid)
  - [GET /manager/shift-plan/manager/shift-plan/:shiftPlanId/details](#get--manager-shift-plan-manager-shift-plan--shiftplanid-details)
  - [POST /manager/shift-plan/manager/shift-plan/:shiftPlanId/details](#post--manager-shift-plan-manager-shift-plan--shiftplanid-details)
  - [GET /manager/shift-plan/manager/shift-plan/:shiftPlanId/download](#get--manager-shift-plan-manager-shift-plan--shiftplanid-download)
  - [POST /manager/shift-plan/manager/shift-plan/:shiftPlanId/time-block-upload](#post--manager-shift-plan-manager-shift-plan--shiftplanid-time-block-upload)
  - [POST /manager/shift-plan/manager/shift-plan/:shiftPlanId/upload](#post--manager-shift-plan-manager-shift-plan--shiftplanid-upload)
  - [GET /manager/shift-plan/manager/shift-plan/employees/attached-shiftplans](#get--manager-shift-plan-manager-shift-plan-employees-attached-shiftplans)
  - [GET /manager/shift-plan/manager/shift-plan/timeBlock/download](#get--manager-shift-plan-manager-shift-plan-timeblock-download)
- [ShiftPlanDetailsController](#shiftplandetailscontroller)
  - [GET /internal/shift-plan-details/internal/shift-plan-details/:shiftPlanId](#get--internal-shift-plan-details-internal-shift-plan-details--shiftplanid)
  - [GET /internal/shift-plan-details/internal/shift-plan-details/:shiftPlanId/employee/:employeeId](#get--internal-shift-plan-details-internal-shift-plan-details--shiftplanid-employee--employeeid)
  - [POST /internal/shift-plan-details/internal/shift-plan-details/change/swappable-status](#post--internal-shift-plan-details-internal-shift-plan-details-change-swappable-status)
  - [PUT /internal/shift-plan-details/internal/shift-plan-details/company/:companyId](#put--internal-shift-plan-details-internal-shift-plan-details-company--companyid)
  - [POST /internal/shift-plan-details/internal/shift-plan-details/create/:companyId/:shiftPlanId/:employeeId](#post--internal-shift-plan-details-internal-shift-plan-details-create--companyid--shiftplanid--employeeid)
  - [GET /internal/shift-plan-details/internal/shift-plan-details/employee/:employeeId](#get--internal-shift-plan-details-internal-shift-plan-details-employee--employeeid)
  - [POST /internal/shift-plan-details/internal/shift-plan-details/employee/create](#post--internal-shift-plan-details-internal-shift-plan-details-employee-create)
  - [GET /internal/shift-plan-details/internal/shift-plan-details/resync-timeblock-id/:companyId](#get--internal-shift-plan-details-internal-shift-plan-details-resync-timeblock-id--companyid)
  - [POST /internal/shift-plan-details/internal/shift-plan-details/swap-shift](#post--internal-shift-plan-details-internal-shift-plan-details-swap-shift)
  - [POST /internal/shift-plan-details/internal/shift-plan-details/validate/overlapping](#post--internal-shift-plan-details-internal-shift-plan-details-validate-overlapping)
- [TimeBlocksController](#timeblockscontroller)
  - [POST /admin/time-blocks/admin/time-blocks](#post--admin-time-blocks-admin-time-blocks)
  - [GET /admin/time-blocks/admin/time-blocks](#get--admin-time-blocks-admin-time-blocks)
  - [PUT /admin/time-blocks/admin/time-blocks/:id](#put--admin-time-blocks-admin-time-blocks--id)
  - [DELETE /admin/time-blocks/admin/time-blocks/:id](#delete--admin-time-blocks-admin-time-blocks--id)
  - [GET /admin/time-blocks/admin/time-blocks/:id](#get--admin-time-blocks-admin-time-blocks--id)
  - [POST /admin/time-blocks/admin/time-blocks/:id/duplicate](#post--admin-time-blocks-admin-time-blocks--id-duplicate)
  - [DELETE /admin/time-blocks/admin/time-blocks/:timeBlockId/schedule/:scheduleId](#delete--admin-time-blocks-admin-time-blocks--timeblockid-schedule--scheduleid)
- [WebhookController](#webhookcontroller)
  - [GET /internal/webhooks/internal/webhooks/availability-status](#get--internal-webhooks-internal-webhooks-availability-status)
  - [GET /internal/webhooks/internal/webhooks/day-availability-status](#get--internal-webhooks-internal-webhooks-day-availability-status)
  - [POST /internal/webhooks/internal/webhooks/generate-timeblock-tags](#post--internal-webhooks-internal-webhooks-generate-timeblock-tags)
  - [POST /internal/webhooks/internal/webhooks/sync-leave](#post--internal-webhooks-internal-webhooks-sync-leave)

## CompanyMigrationController

### GET /internal/company-migration/internal/company-migration/company/:companyId/summary

**Description:** List or search resources from /internal/company-migration/internal/company-migration/company/:companyId/summary

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/company-migration/internal/company-migration/company/:companyid/summary in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### POST /internal/company-migration/internal/company-migration/update-company-id

**Description:** Create a new resource at /internal/company-migration/internal/company-migration/update-company-id

**Use Case:** Developers use this endpoint when they need to create a new resource at /internal/company-migration/internal/company-migration/update-company-id in their application.

**Authentication:** Required (Bearer Token)

**Request Body:**

```json
{
  "oldCompanyId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "newCompanyId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

## MobileHodScheduleController

### GET /mobile/hod/schedules/mobile/hod/schedules

**Description:** List or search resources from /mobile/hod/schedules/mobile/hod/schedules

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /mobile/hod/schedules/mobile/hod/schedules in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **queries** (query): ScheduleFilterPaginationDto

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### POST /mobile/hod/schedules/mobile/hod/schedules

**Description:** Create a new resource at /mobile/hod/schedules/mobile/hod/schedules

**Use Case:** Developers use this endpoint when they need to create a new resource at /mobile/hod/schedules/mobile/hod/schedules in their application.

**Authentication:** Required (Bearer Token)

**Request Body:**

```json
{
  "scheduleType": "sample_scheduleType",
  "name": "sample_name",
  "description": "sample_description",
  "enableBreak": true,
  "absenceStartHours": 42,
  "latenessStartHours": 42,
  "startDate": "sample_startDate",
  "endDate": "sample_endDate",
  "workDays": [
    {}
  ],
  "isCustomWorkDays": true,
  "workStartTime": "sample_workStartTime",
  "workEndTime": "sample_workEndTime",
  "breakStartTime": "sample_breakStartTime",
  "breakEndTime": "sample_breakEndTime",
  "customWorkingDays": [
    {}
  ],
  "policyIds": [
    {}
  ],
  "breakPeriod": 42,
  "sameTimeZone": true,
  "timeZone": "sample_timeZone",
  "isBreakBillable": true
}
```

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /mobile/hod/schedules/mobile/hod/schedules/:scheduleId

**Description:** List or search resources from /mobile/hod/schedules/mobile/hod/schedules/:scheduleId

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /mobile/hod/schedules/mobile/hod/schedules/:scheduleid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **scheduleId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### PUT /mobile/hod/schedules/mobile/hod/schedules/:scheduleId/attach-employees

**Description:** Update an existing resource at /mobile/hod/schedules/mobile/hod/schedules/:scheduleId/attach-employees

**Use Case:** Developers use this endpoint when they need to update an existing resource at /mobile/hod/schedules/mobile/hod/schedules/:scheduleid/attach-employees in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **scheduleId** (path): string

**Request Body:**

```json
{
  "departmentIds": [
    {}
  ],
  "employeeIds": [
    {}
  ],
  "employeeGroupIds": [
    {}
  ],
  "payGroupIds": [
    {}
  ],
  "regionIds": [
    {}
  ],
  "branchIds": [
    {}
  ]
}
```

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /mobile/hod/schedules/mobile/hod/schedules/:scheduleId/employees

**Description:** List or search resources from /mobile/hod/schedules/mobile/hod/schedules/:scheduleId/employees

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /mobile/hod/schedules/mobile/hod/schedules/:scheduleid/employees in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **queries** (query): ScheduleEmployeePaginatorDto
- **scheduleId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### PUT /mobile/hod/schedules/mobile/hod/schedules/:scheduleId/status

**Description:** Update an existing resource at /mobile/hod/schedules/mobile/hod/schedules/:scheduleId/status

**Use Case:** Developers use this endpoint when they need to update an existing resource at /mobile/hod/schedules/mobile/hod/schedules/:scheduleid/status in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **scheduleId** (path): string

**Request Body:**

```json
{
  "status": "sample_status"
}
```

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

## MobileManagerScheduleController

### GET /mobile/manager/schedules/mobile/manager/schedules

**Description:** List or search resources from /mobile/manager/schedules/mobile/manager/schedules

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /mobile/manager/schedules/mobile/manager/schedules in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **queries** (query): ScheduleFilterPaginationDto

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### POST /mobile/manager/schedules/mobile/manager/schedules

**Description:** Create a new resource at /mobile/manager/schedules/mobile/manager/schedules

**Use Case:** Developers use this endpoint when they need to create a new resource at /mobile/manager/schedules/mobile/manager/schedules in their application.

**Authentication:** Required (Bearer Token)

**Request Body:**

```json
{
  "scheduleType": "sample_scheduleType",
  "name": "sample_name",
  "description": "sample_description",
  "enableBreak": true,
  "absenceStartHours": 42,
  "latenessStartHours": 42,
  "startDate": "sample_startDate",
  "endDate": "sample_endDate",
  "workDays": [
    {}
  ],
  "isCustomWorkDays": true,
  "workStartTime": "sample_workStartTime",
  "workEndTime": "sample_workEndTime",
  "breakStartTime": "sample_breakStartTime",
  "breakEndTime": "sample_breakEndTime",
  "customWorkingDays": [
    {}
  ],
  "policyIds": [
    {}
  ],
  "breakPeriod": 42,
  "sameTimeZone": true,
  "timeZone": "sample_timeZone",
  "isBreakBillable": true
}
```

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /mobile/manager/schedules/mobile/manager/schedules/:scheduleId

**Description:** List or search resources from /mobile/manager/schedules/mobile/manager/schedules/:scheduleId

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /mobile/manager/schedules/mobile/manager/schedules/:scheduleid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **scheduleId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### PUT /mobile/manager/schedules/mobile/manager/schedules/:scheduleId/attach-employees

**Description:** Update an existing resource at /mobile/manager/schedules/mobile/manager/schedules/:scheduleId/attach-employees

**Use Case:** Developers use this endpoint when they need to update an existing resource at /mobile/manager/schedules/mobile/manager/schedules/:scheduleid/attach-employees in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **scheduleId** (path): string

**Request Body:**

```json
{
  "departmentIds": [
    {}
  ],
  "employeeIds": [
    {}
  ],
  "employeeGroupIds": [
    {}
  ],
  "payGroupIds": [
    {}
  ],
  "regionIds": [
    {}
  ],
  "branchIds": [
    {}
  ]
}
```

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /mobile/manager/schedules/mobile/manager/schedules/:scheduleId/employees

**Description:** List or search resources from /mobile/manager/schedules/mobile/manager/schedules/:scheduleId/employees

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /mobile/manager/schedules/mobile/manager/schedules/:scheduleid/employees in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **queries** (query): ScheduleEmployeePaginatorDto
- **scheduleId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### PUT /mobile/manager/schedules/mobile/manager/schedules/:scheduleId/status

**Description:** Update an existing resource at /mobile/manager/schedules/mobile/manager/schedules/:scheduleId/status

**Use Case:** Developers use this endpoint when they need to update an existing resource at /mobile/manager/schedules/mobile/manager/schedules/:scheduleid/status in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **scheduleId** (path): string

**Request Body:**

```json
{
  "status": "sample_status"
}
```

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

## MobileScheduleManagerController

### GET /mobile/schedule-managers/mobile/schedule-managers/:scheduleId/employees

**Description:** List or search resources from /mobile/schedule-managers/mobile/schedule-managers/:scheduleId/employees

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /mobile/schedule-managers/mobile/schedule-managers/:scheduleid/employees in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **queries** (query): ScheduleEmployeePaginatorDto
- **scheduleId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /mobile/schedule-managers/mobile/schedule-managers/day-schedule

**Description:** List or search resources from /mobile/schedule-managers/mobile/schedule-managers/day-schedule

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /mobile/schedule-managers/mobile/schedule-managers/day-schedule in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **date** (query): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /mobile/schedule-managers/mobile/schedule-managers/employee-schedules

**Description:** List or search resources from /mobile/schedule-managers/mobile/schedule-managers/employee-schedules

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /mobile/schedule-managers/mobile/schedule-managers/employee-schedules in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **{ startDate, endDate, withAttendance }** (query): EmployeeScheduleQueryDto

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /mobile/schedule-managers/mobile/schedule-managers/my-schedule

**Description:** List or search resources from /mobile/schedule-managers/mobile/schedule-managers/my-schedule

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /mobile/schedule-managers/mobile/schedule-managers/my-schedule in their application.

**Authentication:** Required (Bearer Token)

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /mobile/schedule-managers/mobile/schedule-managers/schedule/:scheduleId/details

**Description:** List or search resources from /mobile/schedule-managers/mobile/schedule-managers/schedule/:scheduleId/details

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /mobile/schedule-managers/mobile/schedule-managers/schedule/:scheduleid/details in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **scheduleId** (path): string
- **shiftPlanDetailsId** (query): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /mobile/schedule-managers/mobile/schedule-managers/shift-plan/:scheduleId/employee

**Description:** List or search resources from /mobile/schedule-managers/mobile/schedule-managers/shift-plan/:scheduleId/employee

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /mobile/schedule-managers/mobile/schedule-managers/shift-plan/:scheduleid/employee in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **{
      page,
      perPage,
      hoursBeforeShiftSwapRequest,
    }** (query): EmployeeShiftPlansFilterPaginationDto
- **scheduleId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /mobile/schedule-managers/mobile/schedule-managers/shift-plan/:scheduleId/employees

**Description:** List or search resources from /mobile/schedule-managers/mobile/schedule-managers/shift-plan/:scheduleId/employees

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /mobile/schedule-managers/mobile/schedule-managers/shift-plan/:scheduleid/employees in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **{ page, perPage }** (query): ShiftPlansFilterPaginationDto
- **scheduleId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /mobile/schedule-managers/mobile/schedule-managers/shift-plan/:scheduleId/user/:userId

**Description:** List or search resources from /mobile/schedule-managers/mobile/schedule-managers/shift-plan/:scheduleId/user/:userId

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /mobile/schedule-managers/mobile/schedule-managers/shift-plan/:scheduleid/user/:userid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **{
      page,
      perPage,
      hoursBeforeShiftSwapRequest,
    }** (query): EmployeeShiftPlansFilterPaginationDto
- **scheduleId** (path): string
- **userId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

## ScheduleController

### POST /admin/schedules/admin/schedules

**Description:** Create a new resource at /admin/schedules/admin/schedules

**Use Case:** Developers use this endpoint when they need to create a new resource at /admin/schedules/admin/schedules in their application.

**Request Body:**

```json
{
  "scheduleType": "sample_scheduleType",
  "name": "sample_name",
  "description": "sample_description",
  "enableBreak": true,
  "absenceStartHours": 42,
  "latenessStartHours": 42,
  "startDate": "sample_startDate",
  "endDate": "sample_endDate",
  "workDays": [
    {}
  ],
  "isCustomWorkDays": true,
  "workStartTime": "sample_workStartTime",
  "workEndTime": "sample_workEndTime",
  "breakStartTime": "sample_breakStartTime",
  "breakEndTime": "sample_breakEndTime",
  "customWorkingDays": [
    {}
  ],
  "policyIds": [
    {}
  ],
  "breakPeriod": 42,
  "sameTimeZone": true,
  "timeZone": "sample_timeZone",
  "isBreakBillable": true
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /admin/schedules/admin/schedules

**Description:** List or search resources from /admin/schedules/admin/schedules

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/schedules/admin/schedules in their application.

**Parameters:**

- **queries** (query): ScheduleFilterPaginationDto

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/schedules/admin/schedules/:scheduleId

**Description:** List or search resources from /admin/schedules/admin/schedules/:scheduleId

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/schedules/admin/schedules/:scheduleid in their application.

**Parameters:**

- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### PUT /admin/schedules/admin/schedules/:scheduleId

**Description:** Update an existing resource at /admin/schedules/admin/schedules/:scheduleId

**Use Case:** Developers use this endpoint when they need to update an existing resource at /admin/schedules/admin/schedules/:scheduleid in their application.

**Parameters:**

- **scheduleId** (path): string

**Request Body:**

```json
{
  "scheduleType": "sample_scheduleType",
  "name": "sample_name",
  "description": "sample_description",
  "enableBreak": true,
  "absenceStartHours": 42,
  "latenessStartHours": 42,
  "startDate": "sample_startDate",
  "endDate": "sample_endDate",
  "workDays": [
    {}
  ],
  "isCustomWorkDays": true,
  "workStartTime": "sample_workStartTime",
  "workEndTime": "sample_workEndTime",
  "breakStartTime": "sample_breakStartTime",
  "breakEndTime": "sample_breakEndTime",
  "customWorkingDays": [
    {}
  ],
  "policyIds": [
    {}
  ],
  "breakPeriod": 42,
  "sameTimeZone": true,
  "timeZone": "sample_timeZone",
  "isBreakBillable": true
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### PUT /admin/schedules/admin/schedules/:scheduleId/attach-employees

**Description:** Update an existing resource at /admin/schedules/admin/schedules/:scheduleId/attach-employees

**Use Case:** Developers use this endpoint when they need to update an existing resource at /admin/schedules/admin/schedules/:scheduleid/attach-employees in their application.

**Parameters:**

- **scheduleId** (path): string

**Request Body:**

```json
{
  "departmentIds": [
    {}
  ],
  "employeeIds": [
    {}
  ],
  "employeeGroupIds": [
    {}
  ],
  "payGroupIds": [
    {}
  ],
  "regionIds": [
    {}
  ],
  "branchIds": [
    {}
  ]
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /admin/schedules/admin/schedules/:scheduleId/attached-employees

**Description:** List or search resources from /admin/schedules/admin/schedules/:scheduleId/attached-employees

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/schedules/admin/schedules/:scheduleid/attached-employees in their application.

**Parameters:**

- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### PUT /admin/schedules/admin/schedules/:scheduleId/detach/employees

**Description:** Update an existing resource at /admin/schedules/admin/schedules/:scheduleId/detach/employees

**Use Case:** Developers use this endpoint when they need to update an existing resource at /admin/schedules/admin/schedules/:scheduleid/detach/employees in their application.

**Parameters:**

- **scheduleId** (path): string

**Request Body:**

```json
{
  "departmentIds": [
    {}
  ],
  "employeeIds": [
    {}
  ],
  "employeeGroupIds": [
    {}
  ],
  "payGroupIds": [
    {}
  ],
  "regionIds": [
    {}
  ],
  "branchIds": [
    {}
  ]
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### PUT /admin/schedules/admin/schedules/:scheduleId/detach/inactive-employees

**Description:** Update an existing resource at /admin/schedules/admin/schedules/:scheduleId/detach/inactive-employees

**Use Case:** Developers use this endpoint when they need to update an existing resource at /admin/schedules/admin/schedules/:scheduleid/detach/inactive-employees in their application.

**Parameters:**

- **scheduleId** (path): string

**Request Body:**

```json
{
  "departmentIds": [
    {}
  ],
  "employeeIds": [
    {}
  ],
  "employeeGroupIds": [
    {}
  ],
  "payGroupIds": [
    {}
  ],
  "regionIds": [
    {}
  ],
  "branchIds": [
    {}
  ]
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### PUT /admin/schedules/admin/schedules/:scheduleId/detach/schedule-employees

**Description:** Update an existing resource at /admin/schedules/admin/schedules/:scheduleId/detach/schedule-employees

**Use Case:** Developers use this endpoint when they need to update an existing resource at /admin/schedules/admin/schedules/:scheduleid/detach/schedule-employees in their application.

**Parameters:**

- **scheduleId** (path): string

**Request Body:**

```json
{
  "departmentIds": [
    {}
  ],
  "employeeIds": [
    {}
  ],
  "employeeGroupIds": [
    {}
  ],
  "payGroupIds": [
    {}
  ],
  "regionIds": [
    {}
  ],
  "branchIds": [
    {}
  ]
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /admin/schedules/admin/schedules/:scheduleId/employee-conflicts

**Description:** List or search resources from /admin/schedules/admin/schedules/:scheduleId/employee-conflicts

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/schedules/admin/schedules/:scheduleid/employee-conflicts in their application.

**Parameters:**

- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/schedules/admin/schedules/:scheduleId/employees

**Description:** List or search resources from /admin/schedules/admin/schedules/:scheduleId/employees

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/schedules/admin/schedules/:scheduleid/employees in their application.

**Parameters:**

- **queries** (query): ScheduleEmployeePaginatorDto
- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### POST /admin/schedules/admin/schedules/:scheduleId/employees

**Description:** Create a new resource at /admin/schedules/admin/schedules/:scheduleId/employees

**Use Case:** Developers use this endpoint when they need to create a new resource at /admin/schedules/admin/schedules/:scheduleid/employees in their application.

**Parameters:**

- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/schedules/admin/schedules/:scheduleId/employees/inactive

**Description:** List or search resources from /admin/schedules/admin/schedules/:scheduleId/employees/inactive

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/schedules/admin/schedules/:scheduleid/employees/inactive in their application.

**Parameters:**

- **queries** (query): InactiveScheduleEmployeePaginatorDto
- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/schedules/admin/schedules/:scheduleId/shift-plan-details

**Description:** List or search resources from /admin/schedules/admin/schedules/:scheduleId/shift-plan-details

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/schedules/admin/schedules/:scheduleid/shift-plan-details in their application.

**Parameters:**

- **queries** (query): ShiftPlansFilterPaginationDto
- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/schedules/admin/schedules/:scheduleId/shift-plans

**Description:** List or search resources from /admin/schedules/admin/schedules/:scheduleId/shift-plans

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/schedules/admin/schedules/:scheduleid/shift-plans in their application.

**Parameters:**

- **queries** (query): ShiftPlansFilterPaginationDto
- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### POST /admin/schedules/admin/schedules/:scheduleId/shift-plans

**Description:** Create a new resource at /admin/schedules/admin/schedules/:scheduleId/shift-plans

**Use Case:** Developers use this endpoint when they need to create a new resource at /admin/schedules/admin/schedules/:scheduleid/shift-plans in their application.

**Parameters:**

- **scheduleId** (path): string

**Request Body:**

```json
{
  "name": "sample_name",
  "description": "sample_description",
  "startDate": "sample_startDate",
  "endDate": "sample_endDate",
  "timeBlockDetails": [
    {}
  ]
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### DELETE /admin/schedules/admin/schedules/:scheduleId/shift-plans/:shiftPlanId

**Description:** Remove a resource from /admin/schedules/admin/schedules/:scheduleId/shift-plans/:shiftPlanId

**Use Case:** Developers use this endpoint when they need to remove a resource from /admin/schedules/admin/schedules/:scheduleid/shift-plans/:shiftplanid in their application.

**Parameters:**

- **scheduleId** (path): string
- **shiftPlanId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/schedules/admin/schedules/:scheduleId/shift-plans/aggregate

**Description:** List or search resources from /admin/schedules/admin/schedules/:scheduleId/shift-plans/aggregate

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/schedules/admin/schedules/:scheduleid/shift-plans/aggregate in their application.

**Parameters:**

- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### PUT /admin/schedules/admin/schedules/:scheduleId/status

**Description:** Update an existing resource at /admin/schedules/admin/schedules/:scheduleId/status

**Use Case:** Developers use this endpoint when they need to update an existing resource at /admin/schedules/admin/schedules/:scheduleid/status in their application.

**Parameters:**

- **scheduleId** (path): string

**Request Body:**

```json
{
  "status": "sample_status"
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /admin/schedules/admin/schedules/:scheduleId/time-blocks

**Description:** List or search resources from /admin/schedules/admin/schedules/:scheduleId/time-blocks

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/schedules/admin/schedules/:scheduleid/time-blocks in their application.

**Parameters:**

- **queries** (query): ScheduleFilterPaginationDto
- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### POST /admin/schedules/admin/schedules/:scheduleId/time-blocks/attach

**Description:** Create a new resource at /admin/schedules/admin/schedules/:scheduleId/time-blocks/attach

**Use Case:** Developers use this endpoint when they need to create a new resource at /admin/schedules/admin/schedules/:scheduleid/time-blocks/attach in their application.

**Parameters:**

- **scheduleId** (path): string

**Request Body:**

```json
{
  "timeBlockIds": [
    {}
  ]
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /admin/schedules/admin/schedules/employee-code/download

**Description:** List or search resources from /admin/schedules/admin/schedules/employee-code/download

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/schedules/admin/schedules/employee-code/download in their application.

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/schedules/admin/schedules/employee/:employeeId/monthly-schedule

**Description:** List or search resources from /admin/schedules/admin/schedules/employee/:employeeId/monthly-schedule

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/schedules/admin/schedules/employee/:employeeid/monthly-schedule in their application.

**Parameters:**

- **{ year, monthIndex }** (query): ScheduleQueryDto
- **employeeId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/schedules/admin/schedules/employee/:employeeId/monthly-schedule/export

**Description:** List or search resources from /admin/schedules/admin/schedules/employee/:employeeId/monthly-schedule/export

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/schedules/admin/schedules/employee/:employeeid/monthly-schedule/export in their application.

**Parameters:**

- **{ year, monthIndex }** (query): ScheduleQueryDto
- **employeeId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/schedules/admin/schedules/employee/:employeeId/schedule-details

**Description:** List or search resources from /admin/schedules/admin/schedules/employee/:employeeId/schedule-details

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/schedules/admin/schedules/employee/:employeeid/schedule-details in their application.

**Parameters:**

- **employeeId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### POST /admin/schedules/admin/schedules/employee/upload/:scheduleId

**Description:** Create a new resource at /admin/schedules/admin/schedules/employee/upload/:scheduleId

**Use Case:** Developers use this endpoint when they need to create a new resource at /admin/schedules/admin/schedules/employee/upload/:scheduleid in their application.

**Parameters:**

- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/schedules/admin/schedules/employees/with-or-without-schedule

**Description:** List or search resources from /admin/schedules/admin/schedules/employees/with-or-without-schedule

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/schedules/admin/schedules/employees/with-or-without-schedule in their application.

**Parameters:**

- **queries** (query): EmployeeInScheduleDto

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/schedules/admin/schedules/employees/with-or-without-schedule/export

**Description:** List or search resources from /admin/schedules/admin/schedules/employees/with-or-without-schedule/export

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/schedules/admin/schedules/employees/with-or-without-schedule/export in their application.

**Parameters:**

- **queries** (query): EmployeeInScheduleDto

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/schedules/admin/schedules/hrms-schedules

**Description:** List or search resources from /admin/schedules/admin/schedules/hrms-schedules

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/schedules/admin/schedules/hrms-schedules in their application.

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### POST /admin/schedules/admin/schedules/hrms-schedules/migrate

**Description:** Create a new resource at /admin/schedules/admin/schedules/hrms-schedules/migrate

**Use Case:** Developers use this endpoint when they need to create a new resource at /admin/schedules/admin/schedules/hrms-schedules/migrate in their application.

**Request Body:**

```json
{
  "hrmsSchedules": [
    {}
  ]
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /admin/schedules/admin/schedules/policy/:policyId

**Description:** List or search resources from /admin/schedules/admin/schedules/policy/:policyId

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/schedules/admin/schedules/policy/:policyid in their application.

**Parameters:**

- **policyId** (path): string
- **queries** (query): ScheduleFilterPaginationDto

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

## ScheduleController

### GET /schedules/schedules/:scheduleId/group-employees

**Description:** List or search resources from /schedules/schedules/:scheduleId/group-employees

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /schedules/schedules/:scheduleid/group-employees in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **body** (query): GroupEmployeesDto
- **scheduleId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

## ScheduleManagementController

### POST /internal/schedules/internal/schedules/:companyId

**Description:** Create a new resource at /internal/schedules/internal/schedules/:companyId

**Use Case:** Developers use this endpoint when they need to create a new resource at /internal/schedules/internal/schedules/:companyid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string

**Request Body:**

```json
{
  "scheduleIds": [
    {}
  ]
}
```

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/schedules/internal/schedules/:companyId/day

**Description:** List or search resources from /internal/schedules/internal/schedules/:companyId/day

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/schedules/internal/schedules/:companyid/day in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string
- **queries** (query): ScheduleFilterPaginationDto

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/schedules/internal/schedules/:companyId/employees

**Description:** List or search resources from /internal/schedules/internal/schedules/:companyId/employees

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/schedules/internal/schedules/:companyid/employees in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/schedules/internal/schedules/:companyId/employees/count

**Description:** List or search resources from /internal/schedules/internal/schedules/:companyId/employees/count

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/schedules/internal/schedules/:companyid/employees/count in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string
- **queries** (query): ScheduleEmployeesCountDto

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/schedules/internal/schedules/:companyId/list

**Description:** List or search resources from /internal/schedules/internal/schedules/:companyId/list

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/schedules/internal/schedules/:companyid/list in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string
- **queries** (query): ScheduleFilterPaginationDto

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/schedules/internal/schedules/:entity-mapping

**Description:** List or search resources from /internal/schedules/internal/schedules/:entity-mapping

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/schedules/internal/schedules/:entity-mapping in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **employeeId** (query): string
- **entityType** (query): EntityType

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/schedules/internal/schedules/:scheduleId

**Description:** List or search resources from /internal/schedules/internal/schedules/:scheduleId

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/schedules/internal/schedules/:scheduleid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (query): string
- **scheduleId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/schedules/internal/schedules/:scheduleId/employees/:companyId

**Description:** List or search resources from /internal/schedules/internal/schedules/:scheduleId/employees/:companyId

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/schedules/internal/schedules/:scheduleid/employees/:companyid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string
- **queries** (query): ScheduleEmployeePaginatorDto
- **scheduleId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/schedules/internal/schedules/:scheduleId/policies

**Description:** List or search resources from /internal/schedules/internal/schedules/:scheduleId/policies

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/schedules/internal/schedules/:scheduleid/policies in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **policyType** (query): PolicyTypeDto
- **scheduleId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### POST /internal/schedules/internal/schedules/:scheduleId/unpublish-remove-employees/:companyId

**Description:** Create a new resource at /internal/schedules/internal/schedules/:scheduleId/unpublish-remove-employees/:companyId

**Use Case:** Developers use this endpoint when they need to create a new resource at /internal/schedules/internal/schedules/:scheduleid/unpublish-remove-employees/:companyid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string
- **scheduleId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### DELETE /internal/schedules/internal/schedules/delete-schedule/:scheduleId

**Description:** Remove a resource from /internal/schedules/internal/schedules/delete-schedule/:scheduleId

**Use Case:** Developers use this endpoint when they need to remove a resource from /internal/schedules/internal/schedules/delete-schedule/:scheduleid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **scheduleId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### POST /internal/schedules/internal/schedules/employee-details/:companyId

**Description:** Create a new resource at /internal/schedules/internal/schedules/employee-details/:companyId

**Use Case:** Developers use this endpoint when they need to create a new resource at /internal/schedules/internal/schedules/employee-details/:companyid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/schedules/internal/schedules/employee-schedules

**Description:** List or search resources from /internal/schedules/internal/schedules/employee-schedules

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/schedules/internal/schedules/employee-schedules in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **{ startDate, endDate, companyId, employeeId }** (query): { startDate: any; endDate: any; companyId: any; employeeId: any; }

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/schedules/internal/schedules/employee/:employeeId

**Description:** List or search resources from /internal/schedules/internal/schedules/employee/:employeeId

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/schedules/internal/schedules/employee/:employeeid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (query): string
- **employeeId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/schedules/internal/schedules/employee/resolve

**Description:** List or search resources from /internal/schedules/internal/schedules/employee/resolve

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/schedules/internal/schedules/employee/resolve in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (query): string
- **date** (query): string
- **employeeId** (query): string
- **time** (query): string
- **withRecord** (query): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### POST /internal/schedules/internal/schedules/employees

**Description:** Create a new resource at /internal/schedules/internal/schedules/employees

**Use Case:** Developers use this endpoint when they need to create a new resource at /internal/schedules/internal/schedules/employees in their application.

**Authentication:** Required (Bearer Token)

**Request Body:**

```json
{
  "employeeIds": [
    {}
  ],
  "scheduleIds": [
    {}
  ],
  "scheduleStatus": "sample_scheduleStatus",
  "companyId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### POST /internal/schedules/internal/schedules/employees-in-schedule/:companyId

**Description:** Create a new resource at /internal/schedules/internal/schedules/employees-in-schedule/:companyId

**Use Case:** Developers use this endpoint when they need to create a new resource at /internal/schedules/internal/schedules/employees-in-schedule/:companyid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string

**Request Body:**

```json
{
  "employeeIds": [
    {}
  ]
}
```

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/schedules/internal/schedules/ended-schedules/:companyId

**Description:** List or search resources from /internal/schedules/internal/schedules/ended-schedules/:companyId

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/schedules/internal/schedules/ended-schedules/:companyid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string
- **filterType** (query): '24HoursBefore' | '12HoursPast'

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### POST /internal/schedules/internal/schedules/holiday-sync/:companyId

**Description:** Create a new resource at /internal/schedules/internal/schedules/holiday-sync/:companyId

**Use Case:** Developers use this endpoint when they need to create a new resource at /internal/schedules/internal/schedules/holiday-sync/:companyid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string

**Request Body:**

```json
{
  "publicHolidayRegion": [
    {}
  ],
  "isPublicHoliday": true,
  "employeesOnLeave": [
    {}
  ],
  "date": "sample_date",
  "company": "sample_company"
}
```

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### POST /internal/schedules/internal/schedules/leave-attendance-sync/:companyId

**Description:** Create a new resource at /internal/schedules/internal/schedules/leave-attendance-sync/:companyId

**Use Case:** Developers use this endpoint when they need to create a new resource at /internal/schedules/internal/schedules/leave-attendance-sync/:companyid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string

**Request Body:**

```json
{
  "employeeIds": [
    {}
  ],
  "startDate": "sample_startDate",
  "endDate": "sample_endDate"
}
```

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/schedules/internal/schedules/mark-past-date-absent/:companyId/:date

**Description:** List or search resources from /internal/schedules/internal/schedules/mark-past-date-absent/:companyId/:date

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/schedules/internal/schedules/mark-past-date-absent/:companyid/:date in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string
- **date** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### POST /internal/schedules/internal/schedules/policy/:policyId/detach

**Description:** Create a new resource at /internal/schedules/internal/schedules/policy/:policyId/detach

**Use Case:** Developers use this endpoint when they need to create a new resource at /internal/schedules/internal/schedules/policy/:policyid/detach in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **policyId** (path): string

**Request Body:**

```json
{
  "scheduleIds": [
    {}
  ]
}
```

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/schedules/internal/schedules/policy/:policyId/in-use

**Description:** List or search resources from /internal/schedules/internal/schedules/policy/:policyId/in-use

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/schedules/internal/schedules/policy/:policyid/in-use in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (query): string
- **policyId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/schedules/internal/schedules/prefill-attendance-records/:companyId/:date

**Description:** List or search resources from /internal/schedules/internal/schedules/prefill-attendance-records/:companyId/:date

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/schedules/internal/schedules/prefill-attendance-records/:companyid/:date in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string
- **date** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### POST /internal/schedules/internal/schedules/remove-employees/:companyId

**Description:** Create a new resource at /internal/schedules/internal/schedules/remove-employees/:companyId

**Use Case:** Developers use this endpoint when they need to create a new resource at /internal/schedules/internal/schedules/remove-employees/:companyid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string

**Request Body:**

```json
{
  "employeeIds": [
    {}
  ]
}
```

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/schedules/internal/schedules/resolve/employees/:companyId/:day

**Description:** List or search resources from /internal/schedules/internal/schedules/resolve/employees/:companyId/:day

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/schedules/internal/schedules/resolve/employees/:companyid/:day in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string
- **day** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/schedules/internal/schedules/schedule-deletion-details/:scheduleId

**Description:** List or search resources from /internal/schedules/internal/schedules/schedule-deletion-details/:scheduleId

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/schedules/internal/schedules/schedule-deletion-details/:scheduleid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **scheduleId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/schedules/internal/schedules/settings/:companyId

**Description:** List or search resources from /internal/schedules/internal/schedules/settings/:companyId

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/schedules/internal/schedules/settings/:companyid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

## ScheduleManagerController

### GET /ess/schedule-managers/ess/schedule-managers/day-schedule

**Description:** List or search resources from /ess/schedule-managers/ess/schedule-managers/day-schedule

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /ess/schedule-managers/ess/schedule-managers/day-schedule in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **{ date }** (query): GetEmployeeDayScheduleDto

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /ess/schedule-managers/ess/schedule-managers/month-schedule

**Description:** List or search resources from /ess/schedule-managers/ess/schedule-managers/month-schedule

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /ess/schedule-managers/ess/schedule-managers/month-schedule in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **{ year, monthIndex }** (query): ScheduleQueryDto

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /ess/schedule-managers/ess/schedule-managers/my-schedule

**Description:** List or search resources from /ess/schedule-managers/ess/schedule-managers/my-schedule

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /ess/schedule-managers/ess/schedule-managers/my-schedule in their application.

**Authentication:** Required (Bearer Token)

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /ess/schedule-managers/ess/schedule-managers/shift-plan/:scheduleId/employee

**Description:** List or search resources from /ess/schedule-managers/ess/schedule-managers/shift-plan/:scheduleId/employee

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /ess/schedule-managers/ess/schedule-managers/shift-plan/:scheduleid/employee in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **{
      page,
      perPage,
      hoursBeforeShiftSwapRequest,
    }** (query): EmployeeShiftPlansFilterPaginationDto
- **scheduleId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /ess/schedule-managers/ess/schedule-managers/shift-plan/:scheduleId/employees

**Description:** List or search resources from /ess/schedule-managers/ess/schedule-managers/shift-plan/:scheduleId/employees

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /ess/schedule-managers/ess/schedule-managers/shift-plan/:scheduleid/employees in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **{ page, perPage }** (query): ShiftPlansFilterPaginationDto
- **scheduleId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /ess/schedule-managers/ess/schedule-managers/shift-plan/:scheduleId/user/:userId

**Description:** List or search resources from /ess/schedule-managers/ess/schedule-managers/shift-plan/:scheduleId/user/:userId

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /ess/schedule-managers/ess/schedule-managers/shift-plan/:scheduleid/user/:userid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **{
      page,
      perPage,
      hoursBeforeShiftSwapRequest,
    }** (query): EmployeeShiftPlansFilterPaginationDto
- **scheduleId** (path): string
- **userId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /ess/schedule-managers/ess/schedule-managers/week-schedule

**Description:** List or search resources from /ess/schedule-managers/ess/schedule-managers/week-schedule

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /ess/schedule-managers/ess/schedule-managers/week-schedule in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **{ startDate, endDate }** (query): GetEmployeeWeekScheduleDto

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

## ScheduleManagerController

### POST /hod/schedules/hod/schedules

**Description:** Create a new resource at /hod/schedules/hod/schedules

**Use Case:** Developers use this endpoint when they need to create a new resource at /hod/schedules/hod/schedules in their application.

**Request Body:**

```json
{
  "scheduleType": "sample_scheduleType",
  "name": "sample_name",
  "description": "sample_description",
  "enableBreak": true,
  "absenceStartHours": 42,
  "latenessStartHours": 42,
  "startDate": "sample_startDate",
  "endDate": "sample_endDate",
  "workDays": [
    {}
  ],
  "isCustomWorkDays": true,
  "workStartTime": "sample_workStartTime",
  "workEndTime": "sample_workEndTime",
  "breakStartTime": "sample_breakStartTime",
  "breakEndTime": "sample_breakEndTime",
  "customWorkingDays": [
    {}
  ],
  "policyIds": [
    {}
  ],
  "breakPeriod": 42,
  "sameTimeZone": true,
  "timeZone": "sample_timeZone",
  "isBreakBillable": true
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /hod/schedules/hod/schedules

**Description:** List or search resources from /hod/schedules/hod/schedules

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /hod/schedules/hod/schedules in their application.

**Parameters:**

- **queries** (query): ScheduleFilterPaginationDto

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### PUT /hod/schedules/hod/schedules/:scheduleId

**Description:** Update an existing resource at /hod/schedules/hod/schedules/:scheduleId

**Use Case:** Developers use this endpoint when they need to update an existing resource at /hod/schedules/hod/schedules/:scheduleid in their application.

**Parameters:**

- **scheduleId** (path): string

**Request Body:**

```json
{
  "scheduleType": "sample_scheduleType",
  "name": "sample_name",
  "description": "sample_description",
  "enableBreak": true,
  "absenceStartHours": 42,
  "latenessStartHours": 42,
  "startDate": "sample_startDate",
  "endDate": "sample_endDate",
  "workDays": [
    {}
  ],
  "isCustomWorkDays": true,
  "workStartTime": "sample_workStartTime",
  "workEndTime": "sample_workEndTime",
  "breakStartTime": "sample_breakStartTime",
  "breakEndTime": "sample_breakEndTime",
  "customWorkingDays": [
    {}
  ],
  "policyIds": [
    {}
  ],
  "breakPeriod": 42,
  "sameTimeZone": true,
  "timeZone": "sample_timeZone",
  "isBreakBillable": true
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /hod/schedules/hod/schedules/:scheduleId/attached-employees

**Description:** List or search resources from /hod/schedules/hod/schedules/:scheduleId/attached-employees

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /hod/schedules/hod/schedules/:scheduleid/attached-employees in their application.

**Parameters:**

- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### PUT /hod/schedules/hod/schedules/:scheduleId/detach/inactive-employees

**Description:** Update an existing resource at /hod/schedules/hod/schedules/:scheduleId/detach/inactive-employees

**Use Case:** Developers use this endpoint when they need to update an existing resource at /hod/schedules/hod/schedules/:scheduleid/detach/inactive-employees in their application.

**Parameters:**

- **scheduleId** (path): string

**Request Body:**

```json
{
  "departmentIds": [
    {}
  ],
  "employeeIds": [
    {}
  ],
  "employeeGroupIds": [
    {}
  ],
  "payGroupIds": [
    {}
  ],
  "regionIds": [
    {}
  ],
  "branchIds": [
    {}
  ]
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### POST /hod/schedules/hod/schedules/:scheduleId/employees

**Description:** Create a new resource at /hod/schedules/hod/schedules/:scheduleId/employees

**Use Case:** Developers use this endpoint when they need to create a new resource at /hod/schedules/hod/schedules/:scheduleid/employees in their application.

**Parameters:**

- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /hod/schedules/hod/schedules/:scheduleId/employees

**Description:** List or search resources from /hod/schedules/hod/schedules/:scheduleId/employees

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /hod/schedules/hod/schedules/:scheduleid/employees in their application.

**Parameters:**

- **queries** (query): ScheduleEmployeePaginatorDto
- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /hod/schedules/hod/schedules/:scheduleId/employees/inactive

**Description:** List or search resources from /hod/schedules/hod/schedules/:scheduleId/employees/inactive

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /hod/schedules/hod/schedules/:scheduleid/employees/inactive in their application.

**Parameters:**

- **queries** (query): InactiveScheduleEmployeePaginatorDto
- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /hod/schedules/hod/schedules/:scheduleId/shift-plan-details

**Description:** List or search resources from /hod/schedules/hod/schedules/:scheduleId/shift-plan-details

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /hod/schedules/hod/schedules/:scheduleid/shift-plan-details in their application.

**Parameters:**

- **queries** (query): ShiftPlansFilterPaginationDto
- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /hod/schedules/hod/schedules/:scheduleId/shift-plans

**Description:** List or search resources from /hod/schedules/hod/schedules/:scheduleId/shift-plans

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /hod/schedules/hod/schedules/:scheduleid/shift-plans in their application.

**Parameters:**

- **queries** (query): ShiftPlansFilterPaginationDto
- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### POST /hod/schedules/hod/schedules/:scheduleId/shift-plans

**Description:** Create a new resource at /hod/schedules/hod/schedules/:scheduleId/shift-plans

**Use Case:** Developers use this endpoint when they need to create a new resource at /hod/schedules/hod/schedules/:scheduleid/shift-plans in their application.

**Parameters:**

- **scheduleId** (path): string

**Request Body:**

```json
{
  "name": "sample_name",
  "description": "sample_description",
  "startDate": "sample_startDate",
  "endDate": "sample_endDate",
  "timeBlockDetails": [
    {}
  ]
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /hod/schedules/hod/schedules/employee/:employeeId/monthly-schedule/export

**Description:** List or search resources from /hod/schedules/hod/schedules/employee/:employeeId/monthly-schedule/export

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /hod/schedules/hod/schedules/employee/:employeeid/monthly-schedule/export in their application.

**Parameters:**

- **{ year, monthIndex }** (query): ScheduleQueryDto
- **employeeId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /hod/schedules/hod/schedules/employee/:employeeId/schedule-details

**Description:** List or search resources from /hod/schedules/hod/schedules/employee/:employeeId/schedule-details

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /hod/schedules/hod/schedules/employee/:employeeid/schedule-details in their application.

**Parameters:**

- **employeeId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### POST /hod/schedules/hod/schedules/employee/upload/:scheduleId

**Description:** Create a new resource at /hod/schedules/hod/schedules/employee/upload/:scheduleId

**Use Case:** Developers use this endpoint when they need to create a new resource at /hod/schedules/hod/schedules/employee/upload/:scheduleid in their application.

**Parameters:**

- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /hod/schedules/hod/schedules/employees/with-or-without-schedule

**Description:** List or search resources from /hod/schedules/hod/schedules/employees/with-or-without-schedule

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /hod/schedules/hod/schedules/employees/with-or-without-schedule in their application.

**Parameters:**

- **queries** (query): EmployeeInScheduleDto

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /hod/schedules/hod/schedules/employees/with-or-without-schedule/export

**Description:** List or search resources from /hod/schedules/hod/schedules/employees/with-or-without-schedule/export

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /hod/schedules/hod/schedules/employees/with-or-without-schedule/export in their application.

**Parameters:**

- **queries** (query): EmployeeInScheduleDto

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

## ScheduleManagerController

### POST /manager/schedules/manager/schedules

**Description:** Create a new resource at /manager/schedules/manager/schedules

**Use Case:** Developers use this endpoint when they need to create a new resource at /manager/schedules/manager/schedules in their application.

**Request Body:**

```json
{
  "scheduleType": "sample_scheduleType",
  "name": "sample_name",
  "description": "sample_description",
  "enableBreak": true,
  "absenceStartHours": 42,
  "latenessStartHours": 42,
  "startDate": "sample_startDate",
  "endDate": "sample_endDate",
  "workDays": [
    {}
  ],
  "isCustomWorkDays": true,
  "workStartTime": "sample_workStartTime",
  "workEndTime": "sample_workEndTime",
  "breakStartTime": "sample_breakStartTime",
  "breakEndTime": "sample_breakEndTime",
  "customWorkingDays": [
    {}
  ],
  "policyIds": [
    {}
  ],
  "breakPeriod": 42,
  "sameTimeZone": true,
  "timeZone": "sample_timeZone",
  "isBreakBillable": true
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /manager/schedules/manager/schedules

**Description:** List or search resources from /manager/schedules/manager/schedules

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /manager/schedules/manager/schedules in their application.

**Parameters:**

- **queries** (query): ScheduleFilterPaginationDto

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### PUT /manager/schedules/manager/schedules/:scheduleId

**Description:** Update an existing resource at /manager/schedules/manager/schedules/:scheduleId

**Use Case:** Developers use this endpoint when they need to update an existing resource at /manager/schedules/manager/schedules/:scheduleid in their application.

**Parameters:**

- **scheduleId** (path): string

**Request Body:**

```json
{
  "scheduleType": "sample_scheduleType",
  "name": "sample_name",
  "description": "sample_description",
  "enableBreak": true,
  "absenceStartHours": 42,
  "latenessStartHours": 42,
  "startDate": "sample_startDate",
  "endDate": "sample_endDate",
  "workDays": [
    {}
  ],
  "isCustomWorkDays": true,
  "workStartTime": "sample_workStartTime",
  "workEndTime": "sample_workEndTime",
  "breakStartTime": "sample_breakStartTime",
  "breakEndTime": "sample_breakEndTime",
  "customWorkingDays": [
    {}
  ],
  "policyIds": [
    {}
  ],
  "breakPeriod": 42,
  "sameTimeZone": true,
  "timeZone": "sample_timeZone",
  "isBreakBillable": true
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /manager/schedules/manager/schedules/:scheduleId/attached-employees

**Description:** List or search resources from /manager/schedules/manager/schedules/:scheduleId/attached-employees

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /manager/schedules/manager/schedules/:scheduleid/attached-employees in their application.

**Parameters:**

- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### PUT /manager/schedules/manager/schedules/:scheduleId/detach/inactive-employees

**Description:** Update an existing resource at /manager/schedules/manager/schedules/:scheduleId/detach/inactive-employees

**Use Case:** Developers use this endpoint when they need to update an existing resource at /manager/schedules/manager/schedules/:scheduleid/detach/inactive-employees in their application.

**Parameters:**

- **scheduleId** (path): string

**Request Body:**

```json
{
  "departmentIds": [
    {}
  ],
  "employeeIds": [
    {}
  ],
  "employeeGroupIds": [
    {}
  ],
  "payGroupIds": [
    {}
  ],
  "regionIds": [
    {}
  ],
  "branchIds": [
    {}
  ]
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### POST /manager/schedules/manager/schedules/:scheduleId/employees

**Description:** Create a new resource at /manager/schedules/manager/schedules/:scheduleId/employees

**Use Case:** Developers use this endpoint when they need to create a new resource at /manager/schedules/manager/schedules/:scheduleid/employees in their application.

**Parameters:**

- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /manager/schedules/manager/schedules/:scheduleId/employees

**Description:** List or search resources from /manager/schedules/manager/schedules/:scheduleId/employees

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /manager/schedules/manager/schedules/:scheduleid/employees in their application.

**Parameters:**

- **queries** (query): ScheduleEmployeePaginatorDto
- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /manager/schedules/manager/schedules/:scheduleId/employees/inactive

**Description:** List or search resources from /manager/schedules/manager/schedules/:scheduleId/employees/inactive

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /manager/schedules/manager/schedules/:scheduleid/employees/inactive in their application.

**Parameters:**

- **queries** (query): InactiveScheduleEmployeePaginatorDto
- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /manager/schedules/manager/schedules/:scheduleId/shift-plan-details

**Description:** List or search resources from /manager/schedules/manager/schedules/:scheduleId/shift-plan-details

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /manager/schedules/manager/schedules/:scheduleid/shift-plan-details in their application.

**Parameters:**

- **queries** (query): ShiftPlansFilterPaginationDto
- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /manager/schedules/manager/schedules/:scheduleId/shift-plans

**Description:** List or search resources from /manager/schedules/manager/schedules/:scheduleId/shift-plans

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /manager/schedules/manager/schedules/:scheduleid/shift-plans in their application.

**Parameters:**

- **queries** (query): ShiftPlansFilterPaginationDto
- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### POST /manager/schedules/manager/schedules/:scheduleId/shift-plans

**Description:** Create a new resource at /manager/schedules/manager/schedules/:scheduleId/shift-plans

**Use Case:** Developers use this endpoint when they need to create a new resource at /manager/schedules/manager/schedules/:scheduleid/shift-plans in their application.

**Parameters:**

- **scheduleId** (path): string

**Request Body:**

```json
{
  "name": "sample_name",
  "description": "sample_description",
  "startDate": "sample_startDate",
  "endDate": "sample_endDate",
  "timeBlockDetails": [
    {}
  ]
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /manager/schedules/manager/schedules/employee/:employeeId/monthly-schedule/export

**Description:** List or search resources from /manager/schedules/manager/schedules/employee/:employeeId/monthly-schedule/export

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /manager/schedules/manager/schedules/employee/:employeeid/monthly-schedule/export in their application.

**Parameters:**

- **{ year, monthIndex }** (query): ScheduleQueryDto
- **employeeId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /manager/schedules/manager/schedules/employee/:employeeId/schedule-details

**Description:** List or search resources from /manager/schedules/manager/schedules/employee/:employeeId/schedule-details

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /manager/schedules/manager/schedules/employee/:employeeid/schedule-details in their application.

**Parameters:**

- **employeeId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### POST /manager/schedules/manager/schedules/employee/upload/:scheduleId

**Description:** Create a new resource at /manager/schedules/manager/schedules/employee/upload/:scheduleId

**Use Case:** Developers use this endpoint when they need to create a new resource at /manager/schedules/manager/schedules/employee/upload/:scheduleid in their application.

**Parameters:**

- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /manager/schedules/manager/schedules/employees/with-or-without-schedule

**Description:** List or search resources from /manager/schedules/manager/schedules/employees/with-or-without-schedule

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /manager/schedules/manager/schedules/employees/with-or-without-schedule in their application.

**Parameters:**

- **queries** (query): EmployeeInScheduleDto

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /manager/schedules/manager/schedules/employees/with-or-without-schedule/export

**Description:** List or search resources from /manager/schedules/manager/schedules/employees/with-or-without-schedule/export

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /manager/schedules/manager/schedules/employees/with-or-without-schedule/export in their application.

**Parameters:**

- **queries** (query): EmployeeInScheduleDto

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

## SharedController

### POST /shared/shared/leave-days

**Description:** Create a new resource at /shared/shared/leave-days

**Use Case:** Developers use this endpoint when they need to create a new resource at /shared/shared/leave-days in their application.

**Authentication:** Required (Bearer Token)

**Request Body:**

```json
{
  "employeeIds": [
    {}
  ],
  "startDate": "sample_startDate",
  "endDate": "sample_endDate"
}
```

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /shared/shared/leave-days

**Description:** List or search resources from /shared/shared/leave-days

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /shared/shared/leave-days in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **queries** (query): LeaveDaysDto

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

## ShiftPlanController

### GET /admin/shift-plans/admin/shift-plans

**Description:** List or search resources from /admin/shift-plans/admin/shift-plans

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/shift-plans/admin/shift-plans in their application.

**Parameters:**

- **queries** (query): ShiftPlansFilterPaginationDto

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/shift-plans/admin/shift-plans/:scheduleId/employee

**Description:** List or search resources from /admin/shift-plans/admin/shift-plans/:scheduleId/employee

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/shift-plans/admin/shift-plans/:scheduleid/employee in their application.

**Parameters:**

- **{
      page,
      perPage,
      hoursBeforeShiftSwapRequest,
      employeeId,
    }** (query): EmployeeShiftPlansFilterPaginationDto
- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/shift-plans/admin/shift-plans/:scheduleId/employees

**Description:** List or search resources from /admin/shift-plans/admin/shift-plans/:scheduleId/employees

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/shift-plans/admin/shift-plans/:scheduleid/employees in their application.

**Parameters:**

- **queries** (query): WithOrWithoutShiftPlansFilterPaginationDto
- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### PATCH /admin/shift-plans/admin/shift-plans/:shiftPlanId

**Description:** Partially update a resource at /admin/shift-plans/admin/shift-plans/:shiftPlanId

**Use Case:** Developers use this endpoint when they need to partially update a resource at /admin/shift-plans/admin/shift-plans/:shiftplanid in their application.

**Parameters:**

- **shiftPlanId** (path): string

**Request Body:**

```json
{}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### DELETE /admin/shift-plans/admin/shift-plans/:shiftPlanId

**Description:** Remove a resource from /admin/shift-plans/admin/shift-plans/:shiftPlanId

**Use Case:** Developers use this endpoint when they need to remove a resource from /admin/shift-plans/admin/shift-plans/:shiftplanid in their application.

**Parameters:**

- **shiftPlanId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/shift-plans/admin/shift-plans/:shiftPlanId

**Description:** List or search resources from /admin/shift-plans/admin/shift-plans/:shiftPlanId

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/shift-plans/admin/shift-plans/:shiftplanid in their application.

**Parameters:**

- **shiftPlanId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/shift-plans/admin/shift-plans/:shiftPlanId/details

**Description:** List or search resources from /admin/shift-plans/admin/shift-plans/:shiftPlanId/details

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/shift-plans/admin/shift-plans/:shiftplanid/details in their application.

**Parameters:**

- **queries** (query): ShiftPlanDetailsQueriesDto
- **shiftPlanId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### POST /admin/shift-plans/admin/shift-plans/:shiftPlanId/details

**Description:** Create a new resource at /admin/shift-plans/admin/shift-plans/:shiftPlanId/details

**Use Case:** Developers use this endpoint when they need to create a new resource at /admin/shift-plans/admin/shift-plans/:shiftplanid/details in their application.

**Parameters:**

- **shiftPlanId** (path): string

**Request Body:**

```json
{
  "shiftPlanDetails": [
    {}
  ]
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### PUT /admin/shift-plans/admin/shift-plans/:shiftPlanId/details

**Description:** Update an existing resource at /admin/shift-plans/admin/shift-plans/:shiftPlanId/details

**Use Case:** Developers use this endpoint when they need to update an existing resource at /admin/shift-plans/admin/shift-plans/:shiftplanid/details in their application.

**Parameters:**

- **shiftPlanId** (path): string

**Request Body:**

```json
{
  "createShifts": "sample_createShifts",
  "deleteShifts": [
    {}
  ]
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### POST /admin/shift-plans/admin/shift-plans/:shiftPlanId/dynamic-time-block-upload

**Description:** Create a new resource at /admin/shift-plans/admin/shift-plans/:shiftPlanId/dynamic-time-block-upload

**Use Case:** Developers use this endpoint when they need to create a new resource at /admin/shift-plans/admin/shift-plans/:shiftplanid/dynamic-time-block-upload in their application.

**Parameters:**

- **shiftPlanId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### POST /admin/shift-plans/admin/shift-plans/:shiftPlanId/time-block-upload

**Description:** Create a new resource at /admin/shift-plans/admin/shift-plans/:shiftPlanId/time-block-upload

**Use Case:** Developers use this endpoint when they need to create a new resource at /admin/shift-plans/admin/shift-plans/:shiftplanid/time-block-upload in their application.

**Parameters:**

- **shiftPlanId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/shift-plans/admin/shift-plans/:shiftPlanId/time-blocks

**Description:** List or search resources from /admin/shift-plans/admin/shift-plans/:shiftPlanId/time-blocks

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/shift-plans/admin/shift-plans/:shiftplanid/time-blocks in their application.

**Parameters:**

- **shiftPlanId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### POST /admin/shift-plans/admin/shift-plans/:shiftPlanId/upload

**Description:** Create a new resource at /admin/shift-plans/admin/shift-plans/:shiftPlanId/upload

**Use Case:** Developers use this endpoint when they need to create a new resource at /admin/shift-plans/admin/shift-plans/:shiftplanid/upload in their application.

**Parameters:**

- **shiftPlanId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/shift-plans/admin/shift-plans/download

**Description:** List or search resources from /admin/shift-plans/admin/shift-plans/download

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/shift-plans/admin/shift-plans/download in their application.

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/shift-plans/admin/shift-plans/employees/attached-shiftplans

**Description:** List or search resources from /admin/shift-plans/admin/shift-plans/employees/attached-shiftplans

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/shift-plans/admin/shift-plans/employees/attached-shiftplans in their application.

**Parameters:**

- **queries** (query): ShiftPlansFilterDto

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/shift-plans/admin/shift-plans/timeBlock/download

**Description:** List or search resources from /admin/shift-plans/admin/shift-plans/timeBlock/download

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/shift-plans/admin/shift-plans/timeblock/download in their application.

**Parameters:**

- **mode** (query): 'custom' | 'dynamic'

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

## ShiftPlanController

### GET /hod/shift-plan/hod/shift-plan/:scheduleId/employees

**Description:** List or search resources from /hod/shift-plan/hod/shift-plan/:scheduleId/employees

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /hod/shift-plan/hod/shift-plan/:scheduleid/employees in their application.

**Parameters:**

- **queries** (query): WithOrWithoutShiftPlansFilterPaginationDto
- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### PATCH /hod/shift-plan/hod/shift-plan/:shiftPlanId

**Description:** Partially update a resource at /hod/shift-plan/hod/shift-plan/:shiftPlanId

**Use Case:** Developers use this endpoint when they need to partially update a resource at /hod/shift-plan/hod/shift-plan/:shiftplanid in their application.

**Parameters:**

- **shiftPlanId** (path): string

**Request Body:**

```json
{}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /hod/shift-plan/hod/shift-plan/:shiftPlanId/details

**Description:** List or search resources from /hod/shift-plan/hod/shift-plan/:shiftPlanId/details

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /hod/shift-plan/hod/shift-plan/:shiftplanid/details in their application.

**Parameters:**

- **queries** (query): ShiftPlanDetailsQueriesDto
- **shiftPlanId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### POST /hod/shift-plan/hod/shift-plan/:shiftPlanId/details

**Description:** Create a new resource at /hod/shift-plan/hod/shift-plan/:shiftPlanId/details

**Use Case:** Developers use this endpoint when they need to create a new resource at /hod/shift-plan/hod/shift-plan/:shiftplanid/details in their application.

**Parameters:**

- **shiftPlanId** (path): string

**Request Body:**

```json
{
  "shiftPlanDetails": [
    {}
  ]
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /hod/shift-plan/hod/shift-plan/:shiftPlanId/download

**Description:** List or search resources from /hod/shift-plan/hod/shift-plan/:shiftPlanId/download

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /hod/shift-plan/hod/shift-plan/:shiftplanid/download in their application.

**Parameters:**

- **shiftPlanId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### POST /hod/shift-plan/hod/shift-plan/:shiftPlanId/dynamic-time-block-upload

**Description:** Create a new resource at /hod/shift-plan/hod/shift-plan/:shiftPlanId/dynamic-time-block-upload

**Use Case:** Developers use this endpoint when they need to create a new resource at /hod/shift-plan/hod/shift-plan/:shiftplanid/dynamic-time-block-upload in their application.

**Parameters:**

- **shiftPlanId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### POST /hod/shift-plan/hod/shift-plan/:shiftPlanId/time-block-upload

**Description:** Create a new resource at /hod/shift-plan/hod/shift-plan/:shiftPlanId/time-block-upload

**Use Case:** Developers use this endpoint when they need to create a new resource at /hod/shift-plan/hod/shift-plan/:shiftplanid/time-block-upload in their application.

**Parameters:**

- **shiftPlanId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### POST /hod/shift-plan/hod/shift-plan/:shiftPlanId/upload

**Description:** Create a new resource at /hod/shift-plan/hod/shift-plan/:shiftPlanId/upload

**Use Case:** Developers use this endpoint when they need to create a new resource at /hod/shift-plan/hod/shift-plan/:shiftplanid/upload in their application.

**Parameters:**

- **shiftPlanId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /hod/shift-plan/hod/shift-plan/employees/attached-shiftplans

**Description:** List or search resources from /hod/shift-plan/hod/shift-plan/employees/attached-shiftplans

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /hod/shift-plan/hod/shift-plan/employees/attached-shiftplans in their application.

**Parameters:**

- **queries** (query): ShiftPlansFilterDto

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /hod/shift-plan/hod/shift-plan/timeBlock/download

**Description:** List or search resources from /hod/shift-plan/hod/shift-plan/timeBlock/download

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /hod/shift-plan/hod/shift-plan/timeblock/download in their application.

**Parameters:**

- **mode** (query): 'custom' | 'dynamic'

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

## ShiftPlanController

### GET /manager/shift-plan/manager/shift-plan/:scheduleId/employees

**Description:** List or search resources from /manager/shift-plan/manager/shift-plan/:scheduleId/employees

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /manager/shift-plan/manager/shift-plan/:scheduleid/employees in their application.

**Parameters:**

- **queries** (query): WithOrWithoutShiftPlansFilterPaginationDto
- **scheduleId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### PATCH /manager/shift-plan/manager/shift-plan/:shiftPlanId

**Description:** Partially update a resource at /manager/shift-plan/manager/shift-plan/:shiftPlanId

**Use Case:** Developers use this endpoint when they need to partially update a resource at /manager/shift-plan/manager/shift-plan/:shiftplanid in their application.

**Parameters:**

- **shiftPlanId** (path): string

**Request Body:**

```json
{}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /manager/shift-plan/manager/shift-plan/:shiftPlanId/details

**Description:** List or search resources from /manager/shift-plan/manager/shift-plan/:shiftPlanId/details

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /manager/shift-plan/manager/shift-plan/:shiftplanid/details in their application.

**Parameters:**

- **queries** (query): ShiftPlanDetailsQueriesDto
- **shiftPlanId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### POST /manager/shift-plan/manager/shift-plan/:shiftPlanId/details

**Description:** Create a new resource at /manager/shift-plan/manager/shift-plan/:shiftPlanId/details

**Use Case:** Developers use this endpoint when they need to create a new resource at /manager/shift-plan/manager/shift-plan/:shiftplanid/details in their application.

**Parameters:**

- **shiftPlanId** (path): string

**Request Body:**

```json
{
  "shiftPlanDetails": [
    {}
  ]
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /manager/shift-plan/manager/shift-plan/:shiftPlanId/download

**Description:** List or search resources from /manager/shift-plan/manager/shift-plan/:shiftPlanId/download

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /manager/shift-plan/manager/shift-plan/:shiftplanid/download in their application.

**Parameters:**

- **shiftPlanId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### POST /manager/shift-plan/manager/shift-plan/:shiftPlanId/time-block-upload

**Description:** Create a new resource at /manager/shift-plan/manager/shift-plan/:shiftPlanId/time-block-upload

**Use Case:** Developers use this endpoint when they need to create a new resource at /manager/shift-plan/manager/shift-plan/:shiftplanid/time-block-upload in their application.

**Parameters:**

- **shiftPlanId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### POST /manager/shift-plan/manager/shift-plan/:shiftPlanId/upload

**Description:** Create a new resource at /manager/shift-plan/manager/shift-plan/:shiftPlanId/upload

**Use Case:** Developers use this endpoint when they need to create a new resource at /manager/shift-plan/manager/shift-plan/:shiftplanid/upload in their application.

**Parameters:**

- **shiftPlanId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /manager/shift-plan/manager/shift-plan/employees/attached-shiftplans

**Description:** List or search resources from /manager/shift-plan/manager/shift-plan/employees/attached-shiftplans

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /manager/shift-plan/manager/shift-plan/employees/attached-shiftplans in their application.

**Parameters:**

- **queries** (query): ShiftPlansFilterDto

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /manager/shift-plan/manager/shift-plan/timeBlock/download

**Description:** List or search resources from /manager/shift-plan/manager/shift-plan/timeBlock/download

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /manager/shift-plan/manager/shift-plan/timeblock/download in their application.

**Parameters:**

- **mode** (query): 'custom' | 'dynamic'

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

## ShiftPlanDetailsController

### GET /internal/shift-plan-details/internal/shift-plan-details/:shiftPlanId

**Description:** List or search resources from /internal/shift-plan-details/internal/shift-plan-details/:shiftPlanId

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/shift-plan-details/internal/shift-plan-details/:shiftplanid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (query): string
- **date** (query): string
- **employeeId** (query): string
- **shiftPlanId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/shift-plan-details/internal/shift-plan-details/:shiftPlanId/employee/:employeeId

**Description:** List or search resources from /internal/shift-plan-details/internal/shift-plan-details/:shiftPlanId/employee/:employeeId

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/shift-plan-details/internal/shift-plan-details/:shiftplanid/employee/:employeeid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **employeeId** (path): string
- **shiftPlanId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### POST /internal/shift-plan-details/internal/shift-plan-details/change/swappable-status

**Description:** Create a new resource at /internal/shift-plan-details/internal/shift-plan-details/change/swappable-status

**Use Case:** Developers use this endpoint when they need to create a new resource at /internal/shift-plan-details/internal/shift-plan-details/change/swappable-status in their application.

**Authentication:** Required (Bearer Token)

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### PUT /internal/shift-plan-details/internal/shift-plan-details/company/:companyId

**Description:** Update an existing resource at /internal/shift-plan-details/internal/shift-plan-details/company/:companyId

**Use Case:** Developers use this endpoint when they need to update an existing resource at /internal/shift-plan-details/internal/shift-plan-details/company/:companyid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### POST /internal/shift-plan-details/internal/shift-plan-details/create/:companyId/:shiftPlanId/:employeeId

**Description:** Create a new resource at /internal/shift-plan-details/internal/shift-plan-details/create/:companyId/:shiftPlanId/:employeeId

**Use Case:** Developers use this endpoint when they need to create a new resource at /internal/shift-plan-details/internal/shift-plan-details/create/:companyid/:shiftplanid/:employeeid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string
- **employeeId** (path): string
- **shiftPlanId** (path): string

**Request Body:**

```json
{
  "shiftPlanDetails": [
    {}
  ]
}
```

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/shift-plan-details/internal/shift-plan-details/employee/:employeeId

**Description:** List or search resources from /internal/shift-plan-details/internal/shift-plan-details/employee/:employeeId

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/shift-plan-details/internal/shift-plan-details/employee/:employeeid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **employeeId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### POST /internal/shift-plan-details/internal/shift-plan-details/employee/create

**Description:** Create a new resource at /internal/shift-plan-details/internal/shift-plan-details/employee/create

**Use Case:** Developers use this endpoint when they need to create a new resource at /internal/shift-plan-details/internal/shift-plan-details/employee/create in their application.

**Authentication:** Required (Bearer Token)

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/shift-plan-details/internal/shift-plan-details/resync-timeblock-id/:companyId

**Description:** List or search resources from /internal/shift-plan-details/internal/shift-plan-details/resync-timeblock-id/:companyId

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/shift-plan-details/internal/shift-plan-details/resync-timeblock-id/:companyid in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (path): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### POST /internal/shift-plan-details/internal/shift-plan-details/swap-shift

**Description:** Create a new resource at /internal/shift-plan-details/internal/shift-plan-details/swap-shift

**Use Case:** Developers use this endpoint when they need to create a new resource at /internal/shift-plan-details/internal/shift-plan-details/swap-shift in their application.

**Authentication:** Required (Bearer Token)

**Request Body:**

```json
{
  "shiftPlanId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "shiftPlanIdForSwap": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "userShiftPlanId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "userShiftPlanIdForSwap": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### POST /internal/shift-plan-details/internal/shift-plan-details/validate/overlapping

**Description:** Create a new resource at /internal/shift-plan-details/internal/shift-plan-details/validate/overlapping

**Use Case:** Developers use this endpoint when they need to create a new resource at /internal/shift-plan-details/internal/shift-plan-details/validate/overlapping in their application.

**Authentication:** Required (Bearer Token)

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

## TimeBlocksController

### POST /admin/time-blocks/admin/time-blocks

**Description:** Create a new resource at /admin/time-blocks/admin/time-blocks

**Use Case:** Developers use this endpoint when they need to create a new resource at /admin/time-blocks/admin/time-blocks in their application.

**Request Body:**

```json
{
  "title": "sample_title",
  "description": "sample_description",
  "is24Hours": true,
  "isOff": true,
  "isLeave": true,
  "requiresClockIn": true,
  "isStatic": true,
  "startsAt": "sample_startsAt",
  "endsAt": "sample_endsAt",
  "colorCode": "sample_colorCode",
  "tag": "sample_tag"
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### GET /admin/time-blocks/admin/time-blocks

**Description:** List or search resources from /admin/time-blocks/admin/time-blocks

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/time-blocks/admin/time-blocks in their application.

**Parameters:**

- **queries** (query): TimeBlockFilterPaginationDto

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### PUT /admin/time-blocks/admin/time-blocks/:id

**Description:** Update an existing resource at /admin/time-blocks/admin/time-blocks/:id

**Use Case:** Developers use this endpoint when they need to update an existing resource at /admin/time-blocks/admin/time-blocks/:id in their application.

**Parameters:**

- **id** (path): string

**Request Body:**

```json
{
  "title": "sample_title",
  "description": "sample_description",
  "is24Hours": true,
  "isOff": true,
  "isLeave": true,
  "requiresClockIn": true,
  "isStatic": true,
  "startsAt": "sample_startsAt",
  "endsAt": "sample_endsAt",
  "colorCode": "sample_colorCode",
  "tag": "sample_tag"
}
```

**Error Scenarios:**

- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

### DELETE /admin/time-blocks/admin/time-blocks/:id

**Description:** Remove a resource from /admin/time-blocks/admin/time-blocks/:id

**Use Case:** Developers use this endpoint when they need to remove a resource from /admin/time-blocks/admin/time-blocks/:id in their application.

**Parameters:**

- **id** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### GET /admin/time-blocks/admin/time-blocks/:id

**Description:** List or search resources from /admin/time-blocks/admin/time-blocks/:id

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /admin/time-blocks/admin/time-blocks/:id in their application.

**Parameters:**

- **id** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### POST /admin/time-blocks/admin/time-blocks/:id/duplicate

**Description:** Create a new resource at /admin/time-blocks/admin/time-blocks/:id/duplicate

**Use Case:** Developers use this endpoint when they need to create a new resource at /admin/time-blocks/admin/time-blocks/:id/duplicate in their application.

**Parameters:**

- **id** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

### DELETE /admin/time-blocks/admin/time-blocks/:timeBlockId/schedule/:scheduleId

**Description:** Remove a resource from /admin/time-blocks/admin/time-blocks/:timeBlockId/schedule/:scheduleId

**Use Case:** Developers use this endpoint when they need to remove a resource from /admin/time-blocks/admin/time-blocks/:timeblockid/schedule/:scheduleid in their application.

**Parameters:**

- **scheduleId** (path): string
- **timeBlockId** (path): string

**Error Scenarios:**

- 500 Internal Server Error - Unexpected server error

---

## WebhookController

### GET /internal/webhooks/internal/webhooks/availability-status

**Description:** List or search resources from /internal/webhooks/internal/webhooks/availability-status

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/webhooks/internal/webhooks/availability-status in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (query): string
- **endDate** (query): string
- **startDate** (query): string

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### GET /internal/webhooks/internal/webhooks/day-availability-status

**Description:** List or search resources from /internal/webhooks/internal/webhooks/day-availability-status

**Use Case:** Developers use this endpoint when they need to fetch or search resources from /internal/webhooks/internal/webhooks/day-availability-status in their application.

**Authentication:** Required (Bearer Token)

**Parameters:**

- **companyId** (query): string
- **date** (query): string
- **key** (query): AvailabilityStatusKeys

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### POST /internal/webhooks/internal/webhooks/generate-timeblock-tags

**Description:** Create a new resource at /internal/webhooks/internal/webhooks/generate-timeblock-tags

**Use Case:** Developers use this endpoint when they need to create a new resource at /internal/webhooks/internal/webhooks/generate-timeblock-tags in their application.

**Authentication:** Required (Bearer Token)

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 500 Internal Server Error - Unexpected server error

---

### POST /internal/webhooks/internal/webhooks/sync-leave

**Description:** Create a new resource at /internal/webhooks/internal/webhooks/sync-leave

**Use Case:** Developers use this endpoint when they need to create a new resource at /internal/webhooks/internal/webhooks/sync-leave in their application.

**Authentication:** Required (Bearer Token)

**Request Body:**

```json
{
  "employeeId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "clientUrl": "sample_clientUrl",
  "companyId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "leaveType": "sample_leaveType",
  "leaveStatus": "sample_leaveStatus",
  "startDate": "sample_startDate",
  "endDate": "sample_endDate",
  "oldEndDate": "sample_oldEndDate",
  "leavePolicy": "sample_leavePolicy",
  "recallDate": "sample_recallDate",
  "isRecalled": true,
  "payTypeOption": "sample_payTypeOption",
  "integrationChannel": "sample_integrationChannel"
}
```

**Error Scenarios:**

- 401 Unauthorized - Invalid or missing authentication
- 400 Bad Request - Invalid request body or parameters
- 500 Internal Server Error - Unexpected server error

---

## Schemas

### UpdateCompanyIdDto

```json
{
  "type": "object",
  "properties": {
    "oldCompanyId": {
      "type": "string"
    },
    "newCompanyId": {
      "type": "string"
    }
  },
  "required": [
    "oldCompanyId",
    "newCompanyId"
  ]
}
```

### CreateScheduleDto

```json
{
  "type": "object",
  "properties": {
    "scheduleType": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "enableBreak": {
      "type": "boolean"
    },
    "absenceStartHours": {
      "type": "number"
    },
    "latenessStartHours": {
      "type": "number"
    },
    "startDate": {
      "type": "string",
      "format": "date-time"
    },
    "endDate": {
      "type": "string",
      "format": "date-time"
    },
    "workDays": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "isCustomWorkDays": {
      "type": "boolean"
    },
    "workStartTime": {
      "type": "string"
    },
    "workEndTime": {
      "type": "string"
    },
    "breakStartTime": {
      "type": "string"
    },
    "breakEndTime": {
      "type": "string"
    },
    "customWorkingDays": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "policyIds": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "breakPeriod": {
      "type": "number"
    },
    "sameTimeZone": {
      "type": "boolean"
    },
    "timeZone": {
      "type": "string"
    },
    "isBreakBillable": {
      "type": "boolean"
    }
  },
  "required": [
    "scheduleType",
    "name",
    "description",
    "enableBreak",
    "absenceStartHours",
    "latenessStartHours",
    "startDate",
    "endDate",
    "workDays",
    "isCustomWorkDays",
    "workStartTime",
    "workEndTime",
    "breakStartTime",
    "breakEndTime",
    "customWorkingDays",
    "policyIds",
    "breakPeriod",
    "sameTimeZone",
    "timeZone",
    "isBreakBillable"
  ]
}
```

### AddEmployeesScheduleDto

```json
{
  "type": "object",
  "properties": {
    "departmentIds": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "employeeIds": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "employeeGroupIds": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "payGroupIds": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "regionIds": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "branchIds": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "departmentIds",
    "employeeIds",
    "employeeGroupIds",
    "payGroupIds",
    "regionIds",
    "branchIds"
  ]
}
```

### UpdateScheduleStatusDto

```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string"
    }
  },
  "required": [
    "status"
  ]
}
```

### CreateShiftPlanDto

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "startDate": {
      "type": "string"
    },
    "endDate": {
      "type": "string"
    },
    "timeBlockDetails": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "name",
    "description",
    "startDate",
    "endDate",
    "timeBlockDetails"
  ]
}
```

### AttachTimeBlocksToScheduleDto

```json
{
  "type": "object",
  "properties": {
    "timeBlockIds": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "timeBlockIds"
  ]
}
```

### CreateHrmsSchedulesDto

```json
{
  "type": "object",
  "properties": {
    "hrmsSchedules": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "hrmsSchedules"
  ]
}
```

### ListSchedulesDto

```json
{
  "type": "object",
  "properties": {
    "scheduleIds": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "scheduleIds"
  ]
}
```

### ScheduleEmployeeFilterDto

```json
{
  "type": "object",
  "properties": {
    "employeeIds": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "scheduleIds": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "scheduleStatus": {
      "type": "string"
    },
    "companyId": {
      "type": "string"
    }
  },
  "required": [
    "employeeIds",
    "scheduleIds",
    "scheduleStatus",
    "companyId"
  ]
}
```

### EmployeesInCompanyScheduleDto

```json
{
  "type": "object",
  "properties": {
    "employeeIds": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "employeeIds"
  ]
}
```

### CompanyHolidaySyncDto

```json
{
  "type": "object",
  "properties": {
    "publicHolidayRegion": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "isPublicHoliday": {
      "type": "boolean"
    },
    "employeesOnLeave": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "date": {
      "type": "string"
    },
    "company": {
      "type": "string"
    }
  },
  "required": [
    "publicHolidayRegion",
    "isPublicHoliday",
    "employeesOnLeave",
    "date",
    "company"
  ]
}
```

### LeaveDaysDto

```json
{
  "type": "object",
  "properties": {
    "employeeIds": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "startDate": {
      "type": "string"
    },
    "endDate": {
      "type": "string"
    }
  },
  "required": [
    "employeeIds",
    "startDate",
    "endDate"
  ]
}
```

### DetachScheduleDto

```json
{
  "type": "object",
  "properties": {
    "scheduleIds": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "scheduleIds"
  ]
}
```

### RemoveEmployeesDto

```json
{
  "type": "object",
  "properties": {
    "employeeIds": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "employeeIds"
  ]
}
```

### UpdateShiftPlanDto

```json
{
  "type": "object",
  "properties": {}
}
```

### CreateShiftPlanDetailsDto

```json
{
  "type": "object",
  "properties": {
    "shiftPlanDetails": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "shiftPlanDetails"
  ]
}
```

### UpdateShiftPlanDetailsDto

```json
{
  "type": "object",
  "properties": {
    "createShifts": {
      "type": "string"
    },
    "deleteShifts": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "createShifts",
    "deleteShifts"
  ]
}
```

### CreateUploadedShiftPlanDetailsDto

```json
{
  "type": "object",
  "properties": {
    "shiftPlanDetails": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "shiftPlanDetails"
  ]
}
```

### ShiftSwapDto

```json
{
  "type": "object",
  "properties": {
    "shiftPlanId": {
      "type": "string"
    },
    "shiftPlanIdForSwap": {
      "type": "string"
    },
    "userShiftPlanId": {
      "type": "string"
    },
    "userShiftPlanIdForSwap": {
      "type": "string"
    }
  },
  "required": [
    "shiftPlanId",
    "shiftPlanIdForSwap",
    "userShiftPlanId",
    "userShiftPlanIdForSwap"
  ]
}
```

### CreateTimeBlockDto

```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "is24Hours": {
      "type": "boolean"
    },
    "isOff": {
      "type": "boolean"
    },
    "isLeave": {
      "type": "boolean"
    },
    "requiresClockIn": {
      "type": "boolean"
    },
    "isStatic": {
      "type": "boolean"
    },
    "startsAt": {
      "type": "string"
    },
    "endsAt": {
      "type": "string"
    },
    "colorCode": {
      "type": "string"
    },
    "tag": {
      "type": "string"
    }
  },
  "required": [
    "title",
    "description",
    "is24Hours",
    "isOff",
    "isLeave",
    "requiresClockIn",
    "isStatic",
    "startsAt",
    "endsAt",
    "colorCode",
    "tag"
  ]
}
```

### UpdateTimeBlockDto

```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "is24Hours": {
      "type": "boolean"
    },
    "isOff": {
      "type": "boolean"
    },
    "isLeave": {
      "type": "boolean"
    },
    "requiresClockIn": {
      "type": "boolean"
    },
    "isStatic": {
      "type": "boolean"
    },
    "startsAt": {
      "type": "string"
    },
    "endsAt": {
      "type": "string"
    },
    "colorCode": {
      "type": "string"
    },
    "tag": {
      "type": "string"
    }
  },
  "required": [
    "title",
    "description",
    "is24Hours",
    "isOff",
    "isLeave",
    "requiresClockIn",
    "isStatic",
    "startsAt",
    "endsAt",
    "colorCode",
    "tag"
  ]
}
```

### LeaveRequestDto

```json
{
  "type": "object",
  "properties": {
    "employeeId": {
      "type": "string"
    },
    "clientUrl": {
      "type": "string"
    },
    "companyId": {
      "type": "string"
    },
    "leaveType": {
      "type": "string"
    },
    "leaveStatus": {
      "type": "string"
    },
    "startDate": {
      "type": "string"
    },
    "endDate": {
      "type": "string"
    },
    "oldEndDate": {
      "type": "string"
    },
    "leavePolicy": {
      "type": "string"
    },
    "recallDate": {
      "type": "string"
    },
    "isRecalled": {
      "type": "boolean"
    },
    "payTypeOption": {
      "type": "string"
    },
    "integrationChannel": {
      "type": "string"
    }
  },
  "required": [
    "employeeId",
    "clientUrl",
    "companyId",
    "leaveType",
    "leaveStatus",
    "startDate",
    "endDate",
    "oldEndDate",
    "leavePolicy",
    "recallDate",
    "isRecalled",
    "payTypeOption",
    "integrationChannel"
  ]
}
```
