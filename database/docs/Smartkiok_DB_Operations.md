# DB Operations

## User

- **CREATE** :  
  id auto, deletion_date -> null, is_admin -> FALSE
  Optionnal : avatar
- **(SOFT) DELETE** :  
  deletion_date -> now()
- **GET**
- **UPDATE** :  
  id, is_admin, deletion_date unchanged
  itself OR admin (from list)
  **LIST** :  
  Admins only
  Lists all users

## Membership

- **CREATE** :  
  roles : 'host' 'cashier' 'guest'  
  **host** : Auto when user creates event  
  **cashier** : Created by host with user.email if user exists n not deleted  
  **guest** : Auto when user scan QR code

- **DELETE** :  
  **all memberships** : Auto when event is deleted  
  **guest** : When user : leave event / join another event
  **cashier** : By host (from list below)
- **LIST OF CASHIER** :  
  Host only
  List of every cashier of an event

## Event

- **CREATE** :  
  id auto, is_active -> TRUE
  Optionnal : image  
  Auto : create membership 'host'
- **DELETE** :  
  Delete all linked memberships  
  (Soft) Delete all linked products (and event_id -> null)
- **GET** :
- **UPDATE** :
  id unchanged
- **LIST** :  
  Only Admins
- **LIST OF USER EVENTS** :  
  All created and undeleted events of a user (host)

## Product

- **CREATE** :  
  id auto, is_available -> TRUE, deletion_date -> null, link to event
  category : dropdown among not deleted  
  optionnal : picture, if not :  
  Option 1 : picture = category.picture  
  Options 2 : picture = null, in list if = null -> = category.picture

- **(SOFT) DELETE** :  
  deletion_date -> now()
- **GET** :
- **UPDATE** :  
  id unchanges
- **LIST FOR AN EVENT (all or by category)** :
  All undeleted products of an event

## Category

- **CREATE** :  
  Admins Only
  id auto, deletion_date -> null
- **(SOFT) DELETE** :  
  deletion_date -> now()
- **GET** :
- **UPDATE** :
  id unchanged
- **LABEL LIST** :  
  Lists only label of undeleted category (for dropdown menu)
- **LIST** :  
  Admins only
  Lists all undeleted category

## VAT

- **CREATE** :
  Admins only
  deletion date -> null
- **(SOFT) DELETE** :  
  deletion_date -> now()
- **GET** :
- **UPDATE** :
  Admins only
  type unchanged (only rate can be changed)
- **LIST** :  
  Admins only
  List of all VAT

## Order Line

- **CREATE** :

- **DELETE** :
- **GET** :
- **UPDATE** :

## Purchase

- **CREATE** :

- **DELETE** :  
  Admins only  
  Delete all order lines of the purchase
- **GET**
- **LIST FOR A USER (= history)** :  
  List all purchase of the user
- **LIST ALL PURCHASE** :  
  Admins only
