# Image Upload System Guide

## 🖼️ **How Image Upload Works**

### **1. File Storage Method**
- ✅ **Images stored in**: `public/uploads/` directory
- ✅ **Database stores**: Only the image URL path (e.g., `/uploads/filename.jpg`)
- ✅ **Benefits**: Fast serving, smaller database, easy management

### **2. Supported Image Formats**
- ✅ **JPEG** (.jpg, .jpeg)
- ✅ **PNG** (.png)
- ✅ **GIF** (.gif)
- ✅ **WebP** (.webp)

### **3. File Size Limits**
- ✅ **Maximum size**: 5MB per image
- ✅ **Validation**: Automatic file type and size checking

## 🚀 **How to Use Image Upload**

### **Step 1: Add Certificate with Image**
1. Go to **Admin Dashboard** → **Certificates**
2. Click **"+ Add Certificate"**
3. Fill in certificate details
4. In the **Image** section:
   - **Option A**: Click **"Choose File"** to upload from computer
   - **Option B**: Enter image URL manually (e.g., `/certificates/iso-9001.jpg`)

### **Step 2: Upload Process**
1. **Select file** from your computer
2. **Automatic validation** (file type and size)
3. **Upload to server** (stored in `public/uploads/`)
4. **Preview shown** immediately
5. **URL saved** to database

### **Step 3: Image Management**
- ✅ **Preview**: See image before saving
- ✅ **Remove**: Click X to remove uploaded image
- ✅ **Replace**: Upload new image to replace existing
- ✅ **Manual URL**: Enter URL directly if image already exists

## 📁 **File Structure**

```
public/
├── uploads/           # Uploaded images stored here
│   ├── 1703123456789-abc123.jpg
│   ├── 1703123456790-def456.png
│   └── ...
├── certificates/      # Static certificate images
│   ├── iso-9001.jpg
│   ├── iso-14001.jpg
│   └── ...
└── ...
```

## 🔧 **Technical Details**

### **API Endpoint**
- **URL**: `POST /api/upload`
- **Input**: FormData with file
- **Output**: JSON with image URL

### **Database Storage**
```sql
-- Certificates table stores image URL
CREATE TABLE certificates (
  id SERIAL PRIMARY KEY,
  name_en VARCHAR(255),
  image_url VARCHAR(500),  -- Stores: /uploads/filename.jpg
  -- ... other fields
);
```

### **Image URLs**
- **Uploaded images**: `/uploads/timestamp-randomstring.ext`
- **Static images**: `/certificates/certificate-name.jpg`
- **External images**: `https://example.com/image.jpg`

## 🛡️ **Security Features**

### **File Validation**
- ✅ **Type checking**: Only image files allowed
- ✅ **Size limits**: Maximum 5MB per file
- ✅ **Unique filenames**: Timestamp + random string
- ✅ **Path sanitization**: Prevents directory traversal

### **Error Handling**
- ✅ **Invalid file type**: Clear error message
- ✅ **File too large**: Size limit warning
- ✅ **Upload failure**: Retry option
- ✅ **Network errors**: Graceful fallback

## 📱 **Usage Examples**

### **Example 1: Upload New Certificate Image**
```javascript
// User uploads: certificate.pdf → server stores as: /uploads/1703123456789-abc123.jpg
// Database stores: image_url = '/uploads/1703123456789-abc123.jpg'
```

### **Example 2: Use Existing Static Image**
```javascript
// User enters: '/certificates/iso-9001.jpg'
// Database stores: image_url = '/certificates/iso-9001.jpg'
```

### **Example 3: Use External Image**
```javascript
// User enters: 'https://example.com/certificate.jpg'
// Database stores: image_url = 'https://example.com/certificate.jpg'
```

## 🎯 **Best Practices**

### **For Certificate Images**
1. **Use high quality** images (at least 800x600px)
2. **Optimize file size** before uploading (compress if needed)
3. **Use consistent naming** for static images
4. **Keep backups** of important certificate images

### **For Performance**
1. **Compress images** before uploading
2. **Use appropriate formats** (JPEG for photos, PNG for graphics)
3. **Consider image dimensions** (don't upload huge images)
4. **Use static images** for frequently used certificates

## 🔄 **Migration from Static Images**

If you have existing static images in `public/certificates/`:

1. **Keep them there** - they'll continue to work
2. **Use the upload system** for new images
3. **Gradually migrate** if you want all images in uploads folder
4. **Update database** to point to new locations if needed

## 🚨 **Troubleshooting**

### **Upload Not Working**
- Check file size (must be < 5MB)
- Check file type (must be image)
- Check network connection
- Check server logs for errors

### **Image Not Displaying**
- Verify image URL in database
- Check if file exists in `public/uploads/`
- Check browser console for 404 errors
- Verify image format is supported

### **Permission Issues**
- Ensure `public/uploads/` directory is writable
- Check file permissions on server
- Verify upload directory exists

## 📊 **Database Schema**

```sql
-- Example certificate with image
INSERT INTO certificates (
  name_en, 
  name_ar, 
  name_ro,
  image_url,
  issued_date,
  expiry_date
) VALUES (
  'ISO 9001:2015 Quality Management',
  'ISO 9001:2015 إدارة الجودة',
  'ISO 9001:2015 Managementul Calității',
  '/uploads/1703123456789-abc123.jpg',  -- Uploaded image
  '2022-01-15',
  '2025-01-14'
);
```

Your image upload system is now ready! 🎉
