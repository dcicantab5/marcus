# Hospital Bed Capacity Planning Dashboard

A comprehensive Monte Carlo simulation-based dashboard for hospital bed capacity planning, comparing deterministic and stochastic approaches to provide more accurate capacity estimates.

## 🏥 Overview

This dashboard analyzes hospital bed requirements using Monte Carlo simulation, incorporating empirical length of stay (LOS) data and variable admission patterns. It provides healthcare administrators and planners with data-driven insights for optimal bed capacity planning.

## 📊 Key Features

### **Interactive Analysis Tabs**
1. **Overview** - Executive summary with key metrics and admission rate analysis
2. **Deterministic vs Stochastic** - Comprehensive comparison of planning approaches
3. **Sensitivity Analysis** - LOS and occupancy rate impact assessment
4. **Capacity Planning** - Service level analysis and recommendations
5. **Model Validation** - Statistical validation and methodology verification

### **Advanced Analytics**
- Monte Carlo simulation with 365-day analysis periods
- Empirical LOS distribution sampling (Mean: 3.56 days)
- Quasi-Poisson admission modeling with daily variation
- 95th and 99th percentile capacity planning
- Interactive parameter selection and real-time updates

## 🚀 Quick Start

### **GitHub Pages Deployment**

1. **Fork or Clone Repository**
   ```bash
   git clone [repository-url]
   cd hospital-bed-capacity-dashboard
   ```

2. **File Structure Verification**
   ```
   repository/
   ├── index.html          # Main dashboard page
   ├── app.js             # JavaScript application logic
   ├── data.json          # Monte Carlo simulation data
   ├── README.md          # This documentation
   ```

3. **GitHub Pages Setup**
   - Go to **Settings** → **Pages** in your GitHub repository
   - **Source**: Deploy from a branch
   - **Branch**: `main` (or `master`)
   - **Folder**: `/ (root)`
   - Click **Save**

4. **Access Dashboard**
   - Your dashboard will be available at: `https://[username].github.io/[repository-name]`
   - Deployment typically takes 5-10 minutes

### **Local Development**

For local testing, serve the files using a simple HTTP server:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server

# Then navigate to: http://localhost:8000
```

## 📈 Monte Carlo Simulation Results

### **Key Findings**
- **40 admissions/day**: Requires **176 beds** for 95% service level
- **48 admissions/day**: Requires **207 beds** for 95% service level
- **Deterministic underestimation**: 27-28 beds for high-volume scenarios
- **Average deviation from Little's Law**: 12.7% (consistent across admission rates)

### **Planning Implications**
- Traditional deterministic methods underestimate capacity needs
- Stochastic modeling provides better risk management
- 10% LOS reduction can decrease bed requirements by 10-15 beds
- Planning for 95th percentile provides optimal service level balance

## 🛠 Technical Architecture

### **Frontend Technologies**
- **HTML5** with semantic structure and accessibility features
- **Bootstrap 5.3.0** for responsive UI components
- **Chart.js 3.9.1** for professional data visualizations
- **Vanilla JavaScript** for optimal performance

### **Data Structure**
The `data.json` file contains:
- **simulationResults**: Monte Carlo outcomes for admission rates 10-50/day
- **deterministicResults**: Little's Law and occupancy target calculations
- **losSensitivity**: Length of stay impact analysis
- **occupancySensitivity**: Occupancy rate sensitivity data
- **distributionData**: Bed occupancy probability distributions
- **validation**: Model validation metrics and comparisons

### **Simulation Methodology**
- **365-day simulation** with 100-day warm-up period
- **Empirical LOS sampling** preserves distribution characteristics
- **Quasi-Poisson admissions**: `admissions = round(rate + sqrt(rate) * randomFactor)`
- **Steady-state initialization** eliminates transient effects

## 📊 Dashboard Sections

### **1. Overview Tab**
- Executive summary with key capacity metrics
- Interactive admission rate selector
- Comprehensive bed requirements visualization
- Real-time planning implications

### **2. Deterministic vs Stochastic Tab**
- Side-by-side methodology comparison
- Capacity underestimation analysis
- Comprehensive comparison table
- Key observations and recommendations

### **3. Sensitivity Analysis Tab**
- Length of stay impact visualization
- Occupancy rate sensitivity charts
- Interactive parameter selection
- Planning strategy implications

### **4. Capacity Planning Tab**
- Bed occupancy distribution modeling
- Service level analysis (95% vs 99%)
- Specific recommendations for 40 and 48 admissions/day
- Risk assessment and buffer calculations

### **5. Model Validation Tab**
- Little's Law comparison and validation
- Linear relationship verification
- Correlation analysis (>0.999 for both P95 and P99)
- Methodology documentation and conclusions

## 🎯 Use Cases

### **Healthcare Administrators**
- Strategic bed capacity planning
- Budget allocation for facility expansion
- Service level optimization
- Risk management and contingency planning

### **Hospital Operations**
- Daily capacity management
- Admission scheduling optimization
- Resource allocation planning
- Performance monitoring

### **Healthcare Consultants**
- Evidence-based capacity recommendations
- Comparative analysis across facilities
- ROI analysis for capacity investments
- Regulatory compliance planning

## 📋 Customization

### **Data Updates**
To update with your own simulation results, modify `data.json`:

```json
{
  "simulationResults": [
    {
      "admissionRate": 40,
      "avgOccupancy": 161.29,
      "p95Occupancy": 176,
      "p99Occupancy": 183,
      "littlesLawPrediction": 142.37
    }
  ]
}
```

### **Styling Customization**
Modify the CSS in `index.html` `<style>` section:
- Color schemes: Update `.metric-card` and chart colors
- Layout: Adjust `.chart-container` dimensions
- Typography: Modify font families and sizes

### **Analytics Integration**
Add your Google Analytics tracking code in the `<head>` section:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
```

## 🔧 Troubleshooting

### **Common Issues**

**Dashboard not loading:**
- Verify all files are in the repository root
- Check browser console for JavaScript errors
- Ensure `data.json` is valid JSON format

**Charts not displaying:**
- Confirm Chart.js CDN is accessible
- Check data structure matches expected format
- Verify canvas elements have correct IDs

**GitHub Pages not updating:**
- Clear browser cache
- Check repository settings → Pages configuration
- Verify branch and folder settings are correct

### **Browser Compatibility**
- **Modern browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile responsive**: Optimized for tablets and smartphones
- **Accessibility**: WCAG 2.1 compliant with proper ARIA labels

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/improvement`)
5. Create a Pull Request

## 📧 Support

For questions, issues, or suggestions:
- Open an issue in the GitHub repository
- Contact: [Your Email/Organization]

## 🎯 Roadmap

- [ ] Real-time data integration APIs
- [ ] Additional statistical distributions
- [ ] Multi-hospital comparative analysis
- [ ] Advanced forecasting models
- [ ] Export functionality for reports

---

**Hospital Bed Capacity Planning Dashboard** | Monte Carlo Simulation Analysis | Healthcare Analytics
