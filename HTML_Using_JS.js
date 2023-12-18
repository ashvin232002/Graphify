var x = `
  <div class="d-flex p-2">
    <div></div>
    <div class="key wall"></div>
    <div> Wall</div>
  </div>
  <div></div>
  <div class="d-flex p-2">
    <div></div>
    <div class="key start"></div>
    <div>Start</div>
    <div></div>
  </div>
  <div class="d-flex p-2">
    <div></div>
    <div class="key end"></div>
    <div>Target</div>
  </div>
  <div class="d-flex p-2">
    <div></div>
    <div class="key searching"></div>
  `;

var y = `
  <div class="key visited"></div>
  <div>Visited</div>
  </div>
  <div class="d-flex p-2">
    <div class="key success"></div>
    <div></div>
    <div>Path/Shortest Path</div>
  </div>
  <div class="d-flex p-2">
    <div class="key"></div>
    <div></div>
    <div>Unvisited</div>
  </div>
`;

document.write(x);
document.write(y);
