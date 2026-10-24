// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}

export async function OPTIONS(req: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}

export async function POST(req: NextRequest) {
  try {
    console.log('Upload request received');
    
    // Check environment variables with better error handling
    const requiredEnvVars = {
      R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
      R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
      R2_ACCESS_KEY: process.env.R2_ACCESS_KEY, // Changed from R2_ACCESS_KEY
      R2_BUCKET_NAME:process.env.R2_BUCKET_NAME, // Changed from NEXT_PUBLIC_R2_Bucket
      R2_PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_URL, // Changed from NEXT_PUBLIC_R2_PUBLIC_URL
    };

    const missingEnvVars = Object.entries(requiredEnvVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingEnvVars.length > 0) {
      console.log('Missing environment variables:', missingEnvVars);
      const response = NextResponse.json({ 
        error: 'Server configuration error', 
        details: `Missing environment variables: ${missingEnvVars.join(', ')}`,
        missingVars: missingEnvVars
      }, { status: 500 });
      return addCorsHeaders(response);
    }

    const formData = await req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      const response = NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      return addCorsHeaders(response);
    }

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      const response = NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
      return addCorsHeaders(response);
    }

    if (file.size > 10 * 1024 * 1024) {
      const response = NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
      return addCorsHeaders(response);
    }

    // Configure R2 client with proper endpoint format
    const r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_ACCESS_KEY!, // Fixed variable name
      },
      forcePathStyle: false, // Important for R2
    });

    // Generate unique filename using the original file name (sanitized)
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const fileName = `imgs/${safeFileName}`;

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload to R2 with proper metadata
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
      ContentLength: file.size,
      Metadata: {
        'original-name': file.name,
        'upload-timestamp': Date.now().toString(),
      }
    });

    console.log('Attempting upload to R2...');
    await r2Client.send(uploadCommand);
    console.log('Upload successful');

    // Construct public URL with proper protocol
    const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
    let publicUrl = `${baseUrl}/${fileName}`;
    
    // Ensure the URL has https:// protocol
    if (!publicUrl.startsWith('https://') && !publicUrl.startsWith('http://')) {
      publicUrl = `https://${publicUrl}`;
    } else if (publicUrl.startsWith('http://')) {
      publicUrl = publicUrl.replace('http://', 'https://');
    }

    const response = NextResponse.json({ 
      url: publicUrl,
      originalName: file.name,
      size: file.size,
      type: file.type,
      fileName: fileName,
      message: 'Upload successful'
    });
    
    return addCorsHeaders(response);

  } catch (error) {
    console.log('Upload error:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.log('Error message:', error.message);
      console.log('Error stack:', error.stack);
    }
    
    const response = NextResponse.json({ 
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
    return addCorsHeaders(response);
  }
}

export async function GET(req: NextRequest) {
  try {
    const envStatus = {
      R2_ACCOUNT_ID: !!process.env.R2_ACCOUNT_ID,
      R2_ACCESS_KEY_ID: !!process.env.R2_ACCESS_KEY_ID,
      R2_ACCESS_KEY: !!process.env.R2_ACCESS_KEY,
      R2_BUCKET_NAME: !!process.env.R2_BUCKET_NAME,
      R2_PUBLIC_URL: !!process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
    };

    const missingVars = Object.entries(envStatus)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    const response = NextResponse.json({ 
      status: missingVars.length === 0 ? 'healthy' : 'configuration_error', 
      timestamp: new Date().toISOString(),
      environment: envStatus,
      missingVars: missingVars,
      message: missingVars.length === 0 ? 'Upload service is ready' : 'Missing environment variables',
      endpoint: process.env.R2_ACCOUNT_ID ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : 'Not configured'
    });
    
    return addCorsHeaders(response);
  } catch (error) {
    console.log('Health check error:', error);
    const response = NextResponse.json(
      { error: 'Health check failed', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}