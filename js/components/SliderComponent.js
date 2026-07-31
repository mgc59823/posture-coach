/**
 * SliderComponent.js
 * Custom range slider for adjusting turtle neck detection sensitivity threshold angle.
 */
export class SliderComponent {
  constructor(containerId, initialValue = 15, onChangeCallback) {
    this.container = document.getElementById(containerId);
    this.value = initialValue;
    this.onChange = onChangeCallback;
    this.render();
  }

  render() {
    this.container.className = 'glass-card slider-container';
    this.container.innerHTML = `
      <div class="slider-header">
        <div class="card-title">
          <span>⚙️</span> 거북목 판단 민감도 (임계 각도)
        </div>
        <span class="slider-value" id="slider-val-display">${this.value}°</span>
      </div>
      <input 
        type="range" 
        id="threshold-slider" 
        class="custom-range-slider" 
        min="5" 
        max="35" 
        step="1" 
        value="${this.value}"
      />
      <div style="font-size: 12px; color: var(--text-muted); text-align: justify; line-height: 1.4;">
        * 귀와 어깨를 잇는 선의 각도가 설정한 임계값보다 커지면 '거북목 자세'로 판단합니다. (기본 권장값: 15°)
      </div>
    `;

    this.slider = document.getElementById('threshold-slider');
    this.valDisplay = document.getElementById('slider-val-display');

    this.slider.addEventListener('input', (e) => {
      this.value = parseInt(e.target.value, 10);
      this.valDisplay.textContent = `${this.value}°`;
      if (this.onChange) this.onChange(this.value);
    });
  }

  getValue() {
    return this.value;
  }
}

if (typeof window !== 'undefined') {
  window.SliderComponent = SliderComponent;
}
