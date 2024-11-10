import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import ApiClientServer from '@/lib/apiClientServer';
import FormData from 'form-data';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ message: 'Invalid file type' }, { status: 400 });
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create FormData for Xano
    const xanoFormData = new FormData();
    xanoFormData.append('file', buffer, {
      filename: file.name,
      contentType: file.type,
      knownLength: buffer.length, // Add content length
    });

    const apiClient = await ApiClientServer();

    // Debug logs
    console.log('Request URL:', `${process.env.XANO_API_GROUP_BASE_URL}/employers/updatePicture`);
    console.log('Form Data Headers:', xanoFormData.getHeaders());
    console.log('File Details:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Send to Xano with explicit headers
    const response = await apiClient.patch(
      `${process.env.XANO_API_GROUP_BASE_URL}/employers/updatePicture`,
      xanoFormData,
      {
        headers: {
          ...xanoFormData.getHeaders(),
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );

    return NextResponse.json({ 
      message: 'Profile picture updated successfully',
      data: response.data,
    }, { status: 200 });

  } catch (error: any) {
    // Enhanced error logging
    console.error('Upload error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config,
      headers: error.response?.headers,
    });

    return NextResponse.json(
      { 
        message: 'Error uploading file', 
        details: error.response?.data || error.message,
        error: error, // Include full error for debugging
      },
      { status: 500 }
    );
  }
}
