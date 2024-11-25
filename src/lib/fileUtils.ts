import FormData from 'form-data';

type FileValidationOptions = {
  maxSizeMB?: number;
  allowedTypes?: string[];
};

export async function processUploadedFile(
  file: File,
  options: FileValidationOptions = {},
  additionalData?: Record<string, string>
) {
  const {
    maxSizeMB = 5,
    allowedTypes = ['image/jpeg', 'image/png'],
  } = options;

  if (!file) {
    throw new Error('No file uploaded');
  }

  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG and PNG files are allowed.');
  }

  // Validate file size
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
  }

  // Convert File to Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create FormData
  const formData = new FormData();
  formData.append('file', buffer, {
    filename: file.name,
    contentType: file.type,
    knownLength: buffer.length,
  });

  // Append any additional data
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  return {
    formData,
    fileDetails: {
      name: file.name,
      type: file.type,
      size: file.size,
    },
  };
}
