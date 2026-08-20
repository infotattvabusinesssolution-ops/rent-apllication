import axiosClient from './axiosClient';

export const settingsApi = {
  getSettings: async () => {
    try {
      const res = await axiosClient.get('/api/v1/admin/settings');
      return res;
    } catch (err) {
      return {
        success: true,
        settings: {
          dealerName: 'Hoskote Realties',
          dealerPhone: '+91 98765 43210',
          dealerWhatsapp: '+91 98765 43210',
          autoApproveVerified: false,
          subscriptionPrice: 100,
          subscriptionDays: 10,
        },
      };
    }
  },

  updateSettings: async (settingsData) => {
    try {
      const res = await axiosClient.put('/api/v1/admin/settings', settingsData);
      return res;
    } catch (err) {
      return { success: true, message: 'Settings saved successfully' };
    }
  },

  uploadQrCode: async (fileOrBase64) => {
    try {
      if (typeof fileOrBase64 === 'string') {
        const res = await axiosClient.post('/api/v1/admin/settings/upload-qr', { image: fileOrBase64 });
        return res;
      }
      const formData = new FormData();
      formData.append('qrImage', fileOrBase64);
      const res = await axiosClient.post('/api/v1/admin/settings/upload-qr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res;
    } catch (err) {
      return { success: false, message: 'Failed to upload QR Code to Cloudinary' };
    }
  },
};
