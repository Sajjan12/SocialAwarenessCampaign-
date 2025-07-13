
    document.getElementById('campaignForm').addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const title = document.getElementById('title').value.trim();
      const description = document.getElementById('description').value.trim();
      const userType = document.getElementById('userType').value;
      const datePosted = new Date().toLocaleString();

      let campaigns = JSON.parse(localStorage.getItem('campaigns')) || [];

      campaigns.push({
        name,
        email,
        title,
        description,
        userType,
        datePosted,
        approved: false
      });

      localStorage.setItem('campaigns', JSON.stringify(campaigns));

      document.getElementById('message').textContent = 'Campaign submitted for approval!';
      this.reset();
    });
  