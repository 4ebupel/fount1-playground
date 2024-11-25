import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import ApiClientServer from '@/lib/apiClientServer';
import { processUploadedFile } from '@/lib/fileUtils';
import basicErrorHandler from '@/lib/basicErrorHandler';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const companyId = formData.get('company_id') as string;
    
    const { formData: xanoFormData } = await processUploadedFile(file, {}, {
      company_id: companyId,
    });

    const apiClient = await ApiClientServer();

    // Debug logs
    console.log('Request URL:', `${process.env.XANO_API_GROUP_BASE_URL}/companies/update/logo`);
    console.log('Form Data Headers:', xanoFormData.getHeaders());

    const response = await apiClient.patch(
      `${process.env.XANO_API_GROUP_BASE_URL}/companies/update/logo`,
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
      message: 'Company logo updated successfully',
      data: response.data,
    }, { status: 200 });

  } catch (error: any) {
    return basicErrorHandler(error, "Error uploading company logo");
  }
}
