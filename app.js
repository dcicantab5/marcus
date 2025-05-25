// Main application script for Hospital Bed Capacity Planning Dashboard
document.addEventListener('DOMContentLoaded', function() {
  // Load data
  fetch('data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      // Initialize the dashboard with the data
      initializeDashboard(data);
      // Hide loading spinner
      document.getElementById('loadingSpinner').style.display = 'none';
    })
    .catch(error => {
      console.error('Error loading data:', error);
      alert('Error loading data. Please check console for details.');
      document.getElementById('loadingSpinner').style.display = 'none';
    });
});

function initializeDashboard(data) {
  // Initialize Overview Tab
  initializeOverviewTab(data);
  
  // Initialize Comparison Tab
  initializeComparisonTab(data);
  
  // Initialize Sensitivity Tab
  initializeSensitivityTab(data);
  
  // Initialize Capacity Tab
  initializeCapacityTab(data);
  
  // Initialize Validation Tab
  initializeValidationTab(data);
  
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

function initializeOverviewTab(data) {
  // Create key metrics cards
  createKeyMetricsCards(data);
  
  // Create overview chart
  createOverviewChart('overviewChart', data.simulationResults);
  
  // Initialize admission rate selector
  initializeAdmissionRateSelector(data);
}

function createKeyMetricsCards(data) {
  const keyMetricsRow = document.getElementById('keyMetricsRow');
  
  // Find results for 40 and 48 admissions
  const result40 = data.simulationResults.find(r => r.admissionRate === 40);
  const result48 = data.simulationResults.find(r => r.admissionRate === 48);
  
  const metrics = [
    {
      title: result40.p95Occupancy,
      subtitle: 'Beds for 40 admissions/day (95th percentile)',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: result48.p95Occupancy,
      subtitle: 'Beds for 48 admissions/day (95th percentile)',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: '3.56',
      subtitle: 'Average Length of Stay (days)',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      title: '12.7%',
      subtitle: 'M.A.R.C.U.S. deviation from Little\'s Law',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ];
  
  keyMetricsRow.innerHTML = '';
  metrics.forEach(metric => {
    const col = document.createElement('div');
    col.className = 'col-md-3 col-sm-6';
    col.innerHTML = `
      <div class="metric-card" style="background: ${metric.color};">
        <h3>${metric.title}</h3>
        <p>${metric.subtitle}</p>
      </div>
    `;
    keyMetricsRow.appendChild(col);
  });
}

function createOverviewChart(canvasId, simulationResults) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  // Prepare data
  const labels = simulationResults.map(r => r.admissionRate);
  const avgOccupancy = simulationResults.map(r => Math.round(r.avgOccupancy));
  const p95Occupancy = simulationResults.map(r => r.p95Occupancy);
  const p99Occupancy = simulationResults.map(r => r.p99Occupancy);
  const littlesLaw = simulationResults.map(r => Math.round(r.littlesLawPrediction));
  
  // Create chart
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Little\'s Law (Deterministic)',
          data: littlesLaw,
          borderColor: 'rgba(88, 103, 221, 1)',
          backgroundColor: 'rgba(88, 103, 221, 0.1)',
          borderWidth: 2,
          tension: 0.1
        },
        {
          label: 'Monte Carlo Average',
          data: avgOccupancy,
          borderColor: 'rgba(255, 193, 7, 1)',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          borderWidth: 2,
          tension: 0.1
        },
        {
          label: '95th Percentile',
          data: p95Occupancy,
          borderColor: 'rgba(255, 115, 0, 1)',
          backgroundColor: 'rgba(255, 115, 0, 0.1)',
          borderWidth: 3,
          tension: 0.1
        },
        {
          label: '99th Percentile',
          data: p99Occupancy,
          borderColor: 'rgba(220, 53, 69, 1)',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          borderWidth: 2,
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Beds Required'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Admissions per Day'
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y} beds`;
            }
          }
        }
      }
    }
  });
}

function initializeAdmissionRateSelector(data) {
  const selector = document.getElementById('admissionRateSelect');
  const detailsDiv = document.getElementById('selectedRateDetails');
  
  function updateDetails() {
    const selectedRate = parseInt(selector.value);
    const result = data.simulationResults.find(r => r.admissionRate === selectedRate);
    
    if (result) {
      detailsDiv.innerHTML = `
        <div class="row">
          <div class="col-md-6">
            <h5>Simulation Results</h5>
            <ul>
              <li><strong>Average occupancy:</strong> ${Math.round(result.avgOccupancy)} beds</li>
              <li><strong>95th percentile:</strong> ${result.p95Occupancy} beds</li>
              <li><strong>99th percentile:</strong> ${result.p99Occupancy} beds</li>
              <li><strong>Maximum observed:</strong> ${result.maxOccupancy} beds</li>
            </ul>
          </div>
          <div class="col-md-6">
            <h5>Planning Implications</h5>
            <ul>
              <li><strong>Service level (95%):</strong> ${result.p95Occupancy} beds needed</li>
              <li><strong>Buffer above Little's Law:</strong> ${result.p95Occupancy - Math.round(result.littlesLawPrediction)} beds</li>
              <li><strong>Average occupancy rate:</strong> ${(result.littlesLawPrediction / result.p95Occupancy * 100).toFixed(1)}%</li>
            </ul>
          </div>
        </div>
      `;
    }
  }
  
  selector.addEventListener('change', updateDetails);
  updateDetails(); // Initialize
}

function initializeComparisonTab(data) {
  // Create comparison chart
  createComparisonChart('comparisonChart', data);
  
  // Create comparison table
  createComparisonTable(data);
  
  // Create observations
  createComparisonObservations(data);
}

function createComparisonChart(canvasId, data) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  // Prepare data
  const labels = data.simulationResults.map(r => r.admissionRate);
  const littlesLaw = data.simulationResults.map(r => Math.round(r.littlesLawPrediction));
  const occupancy95 = data.deterministicResults.map(r => r.bedsFor95Occupancy);
  const simulation95 = data.simulationResults.map(r => r.p95Occupancy);
  const simulation99 = data.simulationResults.map(r => r.p99Occupancy);
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Little\'s Law',
          data: littlesLaw,
          borderColor: 'rgba(88, 103, 221, 1)',
          backgroundColor: 'rgba(88, 103, 221, 0.1)',
          borderWidth: 2
        },
        {
          label: '95% Occupancy Target',
          data: occupancy95,
          borderColor: 'rgba(130, 202, 157, 1)',
          backgroundColor: 'rgba(130, 202, 157, 0.1)',
          borderWidth: 2
        },
        {
          label: 'Monte Carlo 95th Percentile',
          data: simulation95,
          borderColor: 'rgba(255, 115, 0, 1)',
          backgroundColor: 'rgba(255, 115, 0, 0.1)',
          borderWidth: 3
        },
        {
          label: 'Monte Carlo 99th Percentile',
          data: simulation99,
          borderColor: 'rgba(220, 53, 69, 1)',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Beds Required'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Admissions per Day'
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function createComparisonTable(data) {
  const tableBody = document.getElementById('comparisonTableBody');
  tableBody.innerHTML = '';
  
  data.simulationResults.forEach(simResult => {
    const detResult = data.deterministicResults.find(d => d.admissionRate === simResult.admissionRate);
    const underestimation95 = simResult.p95Occupancy - detResult.bedsFor95Occupancy;
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${simResult.admissionRate}</strong></td>
      <td>${Math.round(simResult.littlesLawPrediction)}</td>
      <td>${detResult.bedsFor95Occupancy}</td>
      <td>${Math.round(simResult.avgOccupancy)}</td>
      <td><strong>${simResult.p95Occupancy}</strong></td>
      <td>${simResult.p99Occupancy}</td>
      <td class="text-danger"><strong>+${underestimation95}</strong></td>
    `;
    tableBody.appendChild(row);
  });
}

function createComparisonObservations(data) {
  const observationsList = document.getElementById('comparisonObservations');
  
  // Calculate key statistics
  const result40 = data.simulationResults.find(r => r.admissionRate === 40);
  const result48 = data.simulationResults.find(r => r.admissionRate === 48);
  const det40 = data.deterministicResults.find(r => r.admissionRate === 40);
  const det48 = data.deterministicResults.find(r => r.admissionRate === 48);
  
  const observations = [
    `Monte Carlo simulation consistently estimates 12-13% higher bed requirements than Little's Law predictions`,
    `For 40 admissions/day: Monte Carlo recommends ${result40.p95Occupancy} beds vs ${det40.bedsFor95Occupancy} beds (95% occupancy target) - a difference of ${result40.p95Occupancy - det40.bedsFor95Occupancy} beds`,
    `For 48 admissions/day: Monte Carlo recommends ${result48.p95Occupancy} beds vs ${det48.bedsFor95Occupancy} beds (95% occupancy target) - a difference of ${result48.p95Occupancy - det48.bedsFor95Occupancy} beds`,
    `Planning for 99th percentile service requires only ${result40.p99Occupancy - result40.p95Occupancy}-${result48.p99Occupancy - result48.p95Occupancy} additional beds beyond 95th percentile`,
    `Deterministic methods underestimate capacity needs by 15-30 beds for high-volume scenarios`,
    `The stochastic approach provides better risk management by accounting for daily variability`
  ];
  
  observationsList.innerHTML = '';
  observations.forEach(obs => {
    const li = document.createElement('li');
    li.textContent = obs;
    observationsList.appendChild(li);
  });
}

function initializeSensitivityTab(data) {
  // Create LOS sensitivity chart
  createLosSensitivityChart('losSensitivityChart', data.losSensitivity);
  
  // Create occupancy sensitivity chart
  createOccupancySensitivityChart('occupancySensitivityChart', data.occupancySensitivity);
  
  // Initialize sensitivity controls
  initializeSensitivityControls(data);
}

function createLosSensitivityChart(canvasId, sensitivityData) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  // Use data for 40 admissions/day by default
  const data40 = sensitivityData.admissions40;
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data40.map(d => d.losValue),
      datasets: [
        {
          label: 'Deterministic Beds',
          data: data40.map(d => d.deterministicBeds),
          borderColor: 'rgba(88, 103, 221, 1)',
          backgroundColor: 'rgba(88, 103, 221, 0.1)',
          borderWidth: 2
        },
        {
          label: 'Monte Carlo 95th Percentile',
          data: data40.map(d => d.bedsFor95Percentile),
          borderColor: 'rgba(255, 115, 0, 1)',
          backgroundColor: 'rgba(255, 115, 0, 0.1)',
          borderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Beds Required'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Length of Stay (days)'
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function createOccupancySensitivityChart(canvasId, sensitivityData) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: sensitivityData.occupancyTargets.map(d => d.occupancyTarget),
      datasets: [
        {
          label: '40 Admissions/day',
          data: sensitivityData.occupancyTargets.map(d => d.beds40),
          borderColor: 'rgba(88, 103, 221, 1)',
          backgroundColor: 'rgba(88, 103, 221, 0.1)',
          borderWidth: 2
        },
        {
          label: '48 Admissions/day',
          data: sensitivityData.occupancyTargets.map(d => d.beds48),
          borderColor: 'rgba(255, 115, 0, 1)',
          backgroundColor: 'rgba(255, 115, 0, 0.1)',
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Beds Required'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Target Occupancy Rate (%)'
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function initializeSensitivityControls(data) {
  const selector = document.getElementById('sensitivityAdmissionRate');
  
  selector.addEventListener('change', function() {
    const selectedRate = parseInt(this.value);
    
    // Update LOS sensitivity chart
    const chartData = selectedRate === 40 ? data.losSensitivity.admissions40 : data.losSensitivity.admissions48;
    
    // This would require chart update logic - simplified for this example
    console.log(`Updating sensitivity charts for ${selectedRate} admissions/day`);
  });
}

function initializeCapacityTab(data) {
  // Create distribution chart
  createDistributionChart('distributionChart', data.distributionData);
  
  // Create service level chart
  createServiceLevelChart('serviceLevelChart', data.simulationResults);
  
  // Create recommendations
  createRecommendations(data);
}

function createDistributionChart(canvasId, distributionData) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  // Use distribution for 40 admissions/day as example
  const data40 = distributionData.admissions40;
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data40.map(d => d.occupancy),
      datasets: [
        {
          label: 'Occupancy Distribution',
          data: data40.map(d => d.frequency),
          borderColor: 'rgba(88, 103, 221, 1)',
          backgroundColor: 'rgba(88, 103, 221, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Probability Density'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Number of Beds Occupied'
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function createServiceLevelChart(canvasId, simulationResults) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  // Calculate service levels (percentage of days demand is met)
  const admissionRates = simulationResults.map(r => r.admissionRate);
  const serviceLevel95 = simulationResults.map(r => 95); // By definition
  const serviceLevel99 = simulationResults.map(r => 99); // By definition
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: admissionRates,
      datasets: [
        {
          label: 'Beds for 95% Service Level',
          data: simulationResults.map(r => r.p95Occupancy),
          backgroundColor: 'rgba(88, 103, 221, 0.7)',
          borderColor: 'rgba(88, 103, 221, 1)',
          borderWidth: 1
        },
        {
          label: 'Additional Beds for 99% Service Level',
          data: simulationResults.map(r => r.p99Occupancy - r.p95Occupancy),
          backgroundColor: 'rgba(255, 115, 0, 0.7)',
          borderColor: 'rgba(255, 115, 0, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: 'Admissions per Day'
          }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          title: {
            display: true,
            text: 'Beds Required'
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function createRecommendations(data) {
  const result40 = data.simulationResults.find(r => r.admissionRate === 40);
  const result48 = data.simulationResults.find(r => r.admissionRate === 48);
  
  // Recommendations for 40 admissions/day
  const rec40 = document.getElementById('recommendations40');
  rec40.innerHTML = `
    <li><strong>${result40.p95Occupancy} beds</strong> for 95% service level</li>
    <li><strong>${result40.p99Occupancy} beds</strong> for 99% service level</li>
    <li>Average occupancy: <strong>${(result40.littlesLawPrediction / result40.p95Occupancy * 100).toFixed(1)}%</strong></li>
    <li>Buffer above deterministic: <strong>+${result40.p95Occupancy - Math.round(result40.littlesLawPrediction)} beds</strong></li>
  `;
  
  // Recommendations for 48 admissions/day
  const rec48 = document.getElementById('recommendations48');
  rec48.innerHTML = `
    <li><strong>${result48.p95Occupancy} beds</strong> for 95% service level</li>
    <li><strong>${result48.p99Occupancy} beds</strong> for 99% service level</li>
    <li>Average occupancy: <strong>${(result48.littlesLawPrediction / result48.p95Occupancy * 100).toFixed(1)}%</strong></li>
    <li>Buffer above deterministic: <strong>+${result48.p95Occupancy - Math.round(result48.littlesLawPrediction)} beds</strong></li>
  `;
}

function initializeValidationTab(data) {
  // Create validation chart
  createValidationChart('validationChart', data.simulationResults);
  
  // Update validation metrics
  updateValidationMetrics(data.validation);
}

function createValidationChart(canvasId, simulationResults) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  const admissionRates = simulationResults.map(r => r.admissionRate);
  const littlesLaw = simulationResults.map(r => r.littlesLawPrediction);
  const simulated = simulationResults.map(r => r.avgOccupancy);
  
  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Perfect Agreement',
          data: admissionRates.map(rate => ({
            x: rate * 3.56, // Perfect Little's Law
            y: rate * 3.56
          })),
          borderColor: 'rgba(128, 128, 128, 0.5)',
          backgroundColor: 'rgba(128, 128, 128, 0.5)',
          showLine: true,
          pointRadius: 0,
          borderWidth: 2,
          borderDash: [5, 5]
        },
        {
          label: 'Monte Carlo vs Little\'s Law',
          data: simulationResults.map(r => ({
            x: r.littlesLawPrediction,
            y: r.avgOccupancy
          })),
          borderColor: 'rgba(88, 103, 221, 1)',
          backgroundColor: 'rgba(88, 103, 221, 0.7)',
          pointRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Little\'s Law Prediction (beds)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Monte Carlo Average (beds)'
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function updateValidationMetrics(validation) {
  document.getElementById('avgDeviation').textContent = validation.avgDeviation + '%';
  document.getElementById('correlationP95').textContent = validation.correlationP95;
  document.getElementById('correlationP99').textContent = validation.correlationP99;
}
