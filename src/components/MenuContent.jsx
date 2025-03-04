// components/MenuContent.jsx
function MenuContent() {
  return (
    <div className="menu-content">
      {/* Dashboard Sections */}
      <section id="dashboard" className="content-section">
        <h2>Dashboard</h2>
        <p>Welcome to the main dashboard. Please select a specific section below.</p>
      </section>
      
      <section id="dashboard-overview" className="content-section">
        <h2>Dashboard Overview</h2>
        <div className="card">
          <h3>Overview</h3>
          <p>This is an overview of your account activity and key metrics.</p>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Orders</h4>
              <p className="stat-value">243</p>
              <p className="stat-trend positive">↑ 12%</p>
            </div>
            <div className="stat-card">
              <h4>Total Revenue</h4>
              <p className="stat-value">$12,845</p>
              <p className="stat-trend positive">↑ 8%</p>
            </div>
            <div className="stat-card">
              <h4>Average Order</h4>
              <p className="stat-value">$52.86</p>
              <p className="stat-trend negative">↓ 3%</p>
            </div>
          </div>
        </div>
      </section>
      
      <section id="dashboard-statistics" className="content-section">
        <h2>Dashboard Statistics</h2>
        <div className="card">
          <h3>Detailed Statistics</h3>
          <p>A deeper look into your performance metrics and trends.</p>
          <div className="chart-placeholder">
            [Monthly Sales Chart Visualization]
          </div>
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                  <th>Growth</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>January</td>
                  <td>42</td>
                  <td>$2,310</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>February</td>
                  <td>51</td>
                  <td>$2,845</td>
                  <td>+23%</td>
                </tr>
                <tr>
                  <td>March</td>
                  <td>64</td>
                  <td>$3,420</td>
                  <td>+20%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      <section id="dashboard-performance" className="content-section">
        <h2>Performance Metrics</h2>
        <div className="card">
          <h3>Performance Analysis</h3>
          <p>Detailed breakdown of your performance metrics and KPIs.</p>
          <div className="performance-indicators">
            <div className="indicator">
              <h4>Conversion Rate</h4>
              <div className="progress-bar">
                <div className="progress" style={{ width: '64%' }}></div>
              </div>
              <p>64% (Target: 70%)</p>
            </div>
            <div className="indicator">
              <h4>Customer Satisfaction</h4>
              <div className="progress-bar">
                <div className="progress" style={{ width: '88%' }}></div>
              </div>
              <p>88% (Target: 85%)</p>
            </div>
            <div className="indicator">
              <h4>Return Rate</h4>
              <div className="progress-bar">
                <div className="progress" style={{ width: '12%' }}></div>
              </div>
              <p>12% (Target: &lt; 15%)</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Sections */}
      <section id="contact" className="content-section">
        <h2>Contact</h2>
        <p>Get in touch with our team using the methods below.</p>
      </section>
      
      <section id="contact-form" className="content-section">
        <h2>Contact Form</h2>
        <div className="card">
          <h3>Send us a message</h3>
          <form className="contact-form">
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Your name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Your email" />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <select>
                <option>General Inquiry</option>
                <option>Support</option>
                <option>Feedback</option>
                <option>Partnership</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea placeholder="Your message" rows="5"></textarea>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </section>
      
      <section id="contact-info" className="content-section">
        <h2>Contact Information</h2>
        <div className="card">
          <h3>Our Contact Details</h3>
          <div className="contact-details">
            <div className="contact-method">
              <h4>Email</h4>
              <p>support@example.com</p>
              <p>sales@example.com</p>
            </div>
            <div className="contact-method">
              <h4>Phone</h4>
              <p>+1 (555) 123-4567</p>
              <p>Mon-Fri: 9am - 5pm EST</p>
            </div>
            <div className="contact-method">
              <h4>Address</h4>
              <p>123 Business Street</p>
              <p>Suite 456</p>
              <p>New York, NY 10001</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feedback Sections */}
      <section id="feedback" className="content-section">
        <h2>Feedback</h2>
        <p>See what our customers are saying about us.</p>
      </section>
      
      <section id="feedback-reviews" className="content-section">
        <h2>Customer Reviews</h2>
        <div className="card">
          <h3>Latest Reviews</h3>
          <div className="reviews-list">
            <div className="review-item">
              <div className="review-header">
                <h4>John D.</h4>
                <div className="rating">★★★★★</div>
              </div>
              <p className="review-date">January 15, 2023</p>
              <p className="review-content">
                Excellent service and quality products. I've been a customer for three years and have always been satisfied.
              </p>
            </div>
            <div className="review-item">
              <div className="review-header">
                <h4>Sarah M.</h4>
                <div className="rating">★★★★☆</div>
              </div>
              <p className="review-date">February 2, 2023</p>
              <p className="review-content">
                Great experience overall. The product arrived on time and as described.
                Would definitely order again.
              </p>
            </div>
            <div className="review-item">
              <div className="review-header">
                <h4>Robert P.</h4>
                <div className="rating">★★★★★</div>
              </div>
              <p className="review-date">March 10, 2023</p>
              <p className="review-content">
                Customer service was exceptional. They helped me find exactly what I needed
                and followed up to make sure I was satisfied.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section id="feedback-testimonials" className="content-section">
        <h2>Testimonials</h2>
        <div className="card">
          <h3>Customer Testimonials</h3>
          <div className="testimonials-list">
            <div className="testimonial-item">
              <div className="testimonial-content">
                <p>"This company has transformed how we handle our operations. The tools they provide
                   have increased our efficiency by over 30%."</p>
              </div>
              <div className="testimonial-author">
                <img src="/api/placeholder/50/50" alt="Jane Smith" className="testimonial-avatar" />
                <div className="testimonial-info">
                  <h4>Jane Smith</h4>
                  <p>Operations Director, XYZ Corp</p>
                </div>
              </div>
            </div>
            <div className="testimonial-item">
              <div className="testimonial-content">
                <p>"I've recommended their services to all my colleagues. The attention to detail
                   and quality of work is unmatched in the industry."</p>
              </div>
              <div className="testimonial-author">
                <img src="/api/placeholder/50/50" alt="Michael Johnson" className="testimonial-avatar" />
                <div className="testimonial-info">
                  <h4>Michael Johnson</h4>
                  <p>CEO, ABC Enterprises</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MenuContent;