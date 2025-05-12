import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate an API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Cảm ơn bạn đã liên hệ!');
    }, 2000);
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Liên Hệ Với Chúng Tôi</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Tên của bạn"
          className="w-full p-3 border border-gray-300 rounded-md"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email của bạn"
          className="w-full p-3 border border-gray-300 rounded-md"
          required
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Lời nhắn"
          className="w-full p-3 border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi'}
        </button>
      </form>
    </div>
  );
};

export default Contact;
