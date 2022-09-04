# IMPORTANT
you must create a file called  `Defaults.ts` and provide
following exports in it so the code will work properly

You can copy the `Defaults.ts.ex`  and  use it swell for
reference

## Exports
### ApiService
This class is responsible to making api calls the class which
you should export by  this name  from `Defaults.ts` file must 
`extend` the ApiService class in`@/custom/services/ApiService`

### VueInstanceService
This class is responsible for holding some important  variables
which must be singleton in application and these variables does
not need to be reactive ether  also some  basic initializations
are done in this too

## components
### FieldComponent
to use this field u must provide a v-model field
and also a field-type field types can be of following

1. text 
2. component  
   this one is a useful one it lets developers add their own
   custom inputs to form
3. hidden 
4. file 
5. select 
6. select-v2  
   must pass following arguments as well
   1. select_url
   2. selectV2Config
7. textarea 
8. p-date-time 
9. checkbox 
10. separator 
11. auto-complete 
12. currency

### TableV1
this component is used to created tables using standard
apis an can be changed to a custom one as well

this table works base on a class called Table which is in charge
of controlling and manipulating the table

the table consists of many parts and many of them can be changed
using components of vue and Table class methods