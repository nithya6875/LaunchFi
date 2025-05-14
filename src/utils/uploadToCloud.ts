import axios, { AxiosError } from "axios";

interface MetadataJson {
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

/**
 * Uploads token metadata to Cloudinary
 * 
 * @param jsonData - The metadata to upload
 * @returns The secure URL of the uploaded JSON file
 * @throws Error if upload fails
 */
const uploadToCloud = async (jsonData: MetadataJson): Promise<string> => {
  // Validate environment variables
  const CLOUDNAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  if (!CLOUDNAME) {
    throw new Error("Cloud Name is not configured. Set CLOUDINARY_CLOUD_NAME in environment variables.");
  }

  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "token_lauchpad_upload_preset";
  const URL = `https://api.cloudinary.com/v1_1/${CLOUDNAME}/raw/upload`;

  // Validate input data
  if (!jsonData.name || !jsonData.symbol) {
    throw new Error("Token metadata must include name and symbol");
  }

  try {
    const data = JSON.stringify(jsonData);
    const blob = new Blob([data], { type: "application/json" });
    const fileName = `token-metadata-${Date.now()}.json`;

    const formData = new FormData();
    formData.append('file', blob, fileName);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('resource_type', 'raw');

    // Add timeout to prevent hanging requests
    const response = await axios.post(URL, formData, {
      timeout: 10000, // 10 seconds timeout
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (!response.data || !response.data.secure_url) {
      throw new Error("Invalid response from Cloudinary. Missing secure_url in response data.");
    }

    return response.data.secure_url;
  } catch (error) {
    // Handle specific axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(`Cloudinary upload failed with status ${axiosError.response.status}:`,
          axiosError.response.data);
        throw new Error(`Cloudinary upload failed: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
      } else if (axiosError.request) {
        // The request was made but no response was received
        console.error('No response received from Cloudinary:', axiosError.request);
        throw new Error('No response received from Cloudinary server. Check your network connection.');
      } else if (axiosError.code === 'ECONNABORTED') {
        throw new Error('Request to Cloudinary timed out. Try again later.');
      } else {
        // Error setting up the request
        console.error('Error setting up Cloudinary request:', axiosError.message);
        throw new Error(`Error preparing Cloudinary upload: ${axiosError.message}`);
      }
    } else {
      // Handle non-Axios errors
      console.error('Error uploading JSON to Cloudinary:', error);
      throw new Error(`Failed to upload metadata: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

export default uploadToCloud;
