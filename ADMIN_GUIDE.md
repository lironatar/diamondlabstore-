# מדריך ניהול מנהלים - Diamond Lab Store

## סקירה כללית

המערכת עודכנה עם ניהול מנהלים מושלם וכפתורי ההרשמה וההתחברות הוסרו מהממשק הציבורי.

## מה השתנה

### 1. הסרת כפתורים ציבוריים
- ✅ הוסרו כפתורי "התחבר" ו"הירשם" מתפריט הניווט
- ✅ הוסר כפתור "הצטרפו אלינו" מעמוד הבית
- ✅ הדפים עדיין זמינים כנתיבים נסתרים:
  - `/login` - התחברות
  - `/register` - הרשמה (אך לא מומלץ לשימוש ציבורי)

### 2. ניהול מנהלים מפושט
- ✅ סקריפט חדש ליצירת מנהל עם מייל וסיסמה בלבד
- ✅ תיקון שגיאות bcrypt עם גיבוי לhashing בטוח
- ✅ יצירת שם משתמש אוטומטית מהמייל

## איך ליצור מנהל חדש

### שיטה 1: באמצעות סקריפט פיתון
```bash
cd backend
python create_simple_admin.py
```

### שיטה 2: באמצעות קובץ batch
```bash
create_admin.bat
```

## סקריפטים זמינים

### `create_simple_admin.py`
- יצירת מנהל עם מייל וסיסמה בלבד
- בדיקה אוטומטית של מנהלים קיימים
- יצירת שם משתמש מהמייל

### `reset_admin.py`
- מחיקת כל המנהלים מהמערכת
- שימושי לבדיקות וניסויים

### `create_admin.py` (ישן)
- הסקריפט המלא עם כל הפרטים
- יכול לגרום לשגיאות bcrypt

## כניסה לפאנל הניהול

1. **צור מנהל חדש** (אם לא קיים):
   ```bash
   cd backend
   python create_simple_admin.py
   ```

2. **היכנס לאתר**:
   - עבור לכתובת: `http://localhost:3001/login`
   - הקש את המייל והסיסמה שהגדרת

3. **גש לפאנל הניהול**:
   - לאחר התחברות, עבור לכתובת: `http://localhost:3001/admin`
   - או לחץ על "ניהול" בתפריט העליון

## פאנל הניהול

### דשבורד ראשי
- `http://localhost:3001/admin`
- סטטיסטיקות מהירות
- קישורים לניהול תוכן

### ניהול קטגוריות
- `http://localhost:3001/admin/categories`
- הוסף, ערוך, מחק קטגוריות
- העלאת תמונות

### ניהול מוצרים
- `http://localhost:3001/admin/products`
- ניהול מלא של יהלומים
- מאפיינים ייחודיים ליהלומי מעבדה
- סימון מוצרים נבחרים

## אבטחה

### מה מוגן:
- ✅ כל נתיבי המנהלים דורשים הרשאות
- ✅ העלאת קבצים זמינה רק למנהלים
- ✅ עריכת תוכן זמינה רק למנהלים

### מה נסתר:
- ✅ כפתורי ההרשמה מוסרו מהממשק
- ✅ נתיבי התחברות זמינים רק בכתובת ישירה

## פתרון בעיות

### שגיאת bcrypt
אם תקבל שגיאת bcrypt, השתמש ב-`create_simple_admin.py` במקום הסקריפט הרגיל.

### שכחת סיסמה
```bash
cd backend
python reset_admin.py
python create_simple_admin.py
```

### מנהל לא עובד
בדוק שהמנהל נוצר עם `is_admin=True`:
```bash
cd backend
python -c "
from database import SessionLocal
import models
db = SessionLocal()
admin = db.query(models.User).filter(models.User.email=='YOUR_EMAIL').first()
print(f'Admin status: {admin.is_admin if admin else \"User not found\"}')
"
```

## תזכורות חשובות

1. **שמור את פרטי המנהל** במקום בטוח
2. **השתמש בסיסמה חזקה** בסביבת ייצור
3. **הנתיב `/login` הוא הדרך היחידה** להתחבר למערכת
4. **לא ליצור מנהלים נוספים** ללא צורך

## פקודות שימושיות

```bash
# יצירת מנהל חדש
cd backend && python create_simple_admin.py

# איפוס כל המנהלים
cd backend && python reset_admin.py

# הפעלת השרתים
start.bat

# בדיקת מנהלים קיימים
cd backend && python -c "
from database import SessionLocal
import models
db = SessionLocal()
admins = db.query(models.User).filter(models.User.is_admin==True).all()
for admin in admins:
    print(f'{admin.email} - {admin.full_name}')
" 