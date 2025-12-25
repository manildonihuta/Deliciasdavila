
document.addEventListener("DOMContentLoaded", function() {
  const bookingForm = document.getElementById('booking-form');

  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Basic Validation (HTML5 usually handles this, but good to be safe)
      const name = bookingForm.querySelector('input[name="name"]').value;
      const email = bookingForm.querySelector('input[name="email"]').value;
      const phone = bookingForm.querySelector('input[name="phone"]').value;
      const date = bookingForm.querySelector('input[name="date"]').value;
      const time = bookingForm.querySelector('input[name="time"]').value;
      const people = bookingForm.querySelector('input[name="people"]').value;
      const message = bookingForm.querySelector('textarea[name="message"]').value;

      if (!name || !people || !date || !time) {
        alert("Por favor, preencha os campos obrigatórios.");
        return;
      }

      // Format Message
      let whatsappMsg = `*Nova Reserva - Delícias da Vila*\n\n`;
      whatsappMsg += `*Nome:* ${name}\n`;
      whatsappMsg += `*Data:* ${date}\n`;
      whatsappMsg += `*Hora:* ${time}\n`;
      whatsappMsg += `*Pessoas:* ${people}\n`;
      whatsappMsg += `*Telefone:* ${phone}\n`;
      whatsappMsg += `*Email:* ${email}\n`;
      if (message) {
        whatsappMsg += `*Mensagem:* ${message}\n`;
      }

      // Encode and Redirect
      const encodedMsg = encodeURIComponent(whatsappMsg);
      // Replace with the actual restaurant number if known, otherwise use a placeholder
      // Based on footer: +258 86 885 6210
      const phoneNumber = "258868856210"; 
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMsg}`;

      window.open(whatsappUrl, '_blank');
    });
  }
});
