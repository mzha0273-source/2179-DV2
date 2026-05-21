const charts = [
  ["vis-01", "charts/01_recovery_index_multiline.json"],
  ["vis-02", "charts/02_enrolments_area.json"],
  ["vis-03", "charts/03_commencements_lollipop.json"],
  ["vis-04", "charts/04_exports_enrolments_scatter.json"],
  ["vis-05", "charts/05_sector_donut.json"],
  ["vis-06", "charts/06_state_market_share_map.json"],
  ["vis-07", "charts/07_top_nationalities_bar.json"],
  ["vis-08", "charts/08_rank_slopegraph.json"],
  ["vis-09", "charts/09_visa_lodgements_line.json"],
  ["vis-10", "charts/10_recovery_heatmap.json"],
  ["vis-11", "charts/11_sector_estimated_counts.json"],
  ["vis-12", "charts/12_nationality_pareto.json"]
];

async function drawChart(elementId, specPath) {
  const element = document.getElementById(elementId);

  try {
    const response = await fetch(specPath);
    if (!response.ok) {
      throw new Error(`${specPath} returned HTTP ${response.status}`);
    }

    const spec = await response.json();

    await vegaEmbed(element, spec, {
      actions: false,
      renderer: "svg",
      downloadFileName: elementId
    });
  } catch (error) {
    console.error(`Failed to render ${elementId}:`, error);
    element.innerHTML = `
      <div class="chart-error">
        Chart failed to load. Check that ${specPath} and the data folder are uploaded in the repository root.
      </div>
    `;
  }
}

window.addEventListener("load", () => {
  if (typeof vegaEmbed === "undefined") {
    document.querySelectorAll(".chart").forEach(element => {
      element.innerHTML = `
        <div class="chart-error">
          Vega-Lite library did not load. Refresh the page or check the internet connection/CDN access.
        </div>
      `;
    });
    return;
  }

  charts.forEach(([elementId, specPath]) => drawChart(elementId, specPath));
});

window.addEventListener("resize", () => {
  clearTimeout(window.__resizeTimer);
  window.__resizeTimer = setTimeout(() => {
    charts.forEach(([elementId, specPath]) => {
      const element = document.getElementById(elementId);
      element.innerHTML = "";
      drawChart(elementId, specPath);
    });
  }, 250);
});
