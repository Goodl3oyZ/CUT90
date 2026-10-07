# Cut 90 Planner - Mathematical & Physiological Formulas

This document details the exact mathematical formulas, physiological algorithms, and safety parameters powering the Cut 90 Planner calculation engine (`src/lib/plan`).

---

## 1. Primary BMR & TDEE Formulas (Mifflin-St Jeor)

### Basal Metabolic Rate (BMR)
Calculated using the **Mifflin-St Jeor Equation**, recognized as the most reliable standard for non-obese and obese adults.

$$\text{BMR}_{\text{male}} = (10 \times W) + (6.25 \times H) - (5 \times A) + 5$$
$$\text{BMR}_{\text{female}} = (10 \times W) + (6.25 \times H) - (5 \times A) - 161$$

Where:
* $W$ = Body weight in kilograms (kg)
* $H$ = Height in centimeters (cm)
* $A$ = Age in years

### Total Daily Energy Expenditure (TDEE)
$$\text{TDEE} = \text{BMR} \times \text{Activity Multiplier}$$

| Activity Level Key | Description | Multiplier |
| :--- | :--- | :--- |
| `sedentary` | Desk job, little/no exercise | **1.200** |
| `lightly` | Light exercise 1-3 days/week | **1.375** |
| `moderately` | Moderate exercise 3-5 days/week | **1.550** |
| `very` | Heavy exercise 6-7 days/week | **1.725** |
| `extremely` | Athlete / physical labor | **1.900** |

---

## 2. 90-Day Step-Down Deficit Algorithm

### Weight Delta & Daily Energy Deficit
* Total target weight loss: $\Delta W = W_{\text{start}} - W_{\text{goal}}$
* Total energy deficit needed: $E_{\text{total}} = \Delta W \times 7700 \text{ kcal}$
* Required daily energy deficit:
$$\text{Deficit}_{\text{daily}} = \frac{E_{\text{total}}}{90}$$

### Daily Dynamic Weight & Target Calorie Calculation
To account for metabolic slowdown as weight drops, the expected weight on day $d \in [1, 90]$ is:
$$W(d) = W_{\text{start}} - \left( \frac{d - 1}{89} \times \Delta W \right)$$

On each day $d$:
1. Calculate expected BMR: $\text{BMR}(d) = (10 \times W(d)) + (6.25 \times H) - (5 \times A) + 5$
2. Calculate expected TDEE: $\text{TDEE}(d) = \text{BMR}(d) \times \text{Activity}$
3. Calculate target calories:
$$\text{TargetKcal}(d) = \max\left( \text{BMR}(d), \text{round}\left( \text{TDEE}(d) - \text{Deficit}_{\text{daily}} \right) \right)$$

---

## 3. Worked Canonical Example

### Inputs
* **Sex**: Male
* **Age**: 30 years
* **Height**: 175 cm
* **Start Weight**: 79.3 kg
* **Goal Weight**: 69.5 kg
* **Activity Level**: 1.55 (`moderately`)
* **Protein ratio**: 2.1 g/kg
* **Fat ratio**: 0.8 g/kg

### Step-by-Step Calculation
1. **Total Weight Loss Target**:
   $$\Delta W = 79.3 - 69.5 = 9.8 \text{ kg}$$
2. **Total Deficit Required**:
   $$E_{\text{total}} = 9.8 \times 7700 = 75,460 \text{ kcal}$$
3. **Daily Required Deficit**:
   $$\text{Deficit}_{\text{daily}} = \frac{75460}{90} \approx 838.44 \text{ kcal/day}$$

4. **Day 1 Parameters ($d=1, W=79.3\text{ kg}$)**:
   * $\text{BMR}(1) = (10 \times 79.3) + (6.25 \times 175) - (5 \times 30) + 5 = 793 + 1093.75 - 150 + 5 = 1741.75 \text{ kcal}$
   * $\text{TDEE}(1) = 1741.75 \times 1.55 = 2699.71 \text{ kcal}$
   * $\text{TargetKcal}(1) = 2700 - 838 = \mathbf{1862 \text{ kcal}}$ (Approx ~1851 kcal depending on sub-day rounding)
   * **Macros Day 1**:
     * Protein: $79.3 \times 2.1 = 166.53 \approx \mathbf{167 \text{ g}}$ ($668 \text{ kcal}$)
     * Fat: $79.3 \times 0.8 = 63.44 \approx \mathbf{63 \text{ g}}$ ($567 \text{ kcal}$)
     * Carb: $\frac{1862 - (668 + 567)}{4} = \frac{627}{4} \approx \mathbf{157 \text{ g}}$

5. **Day 90 Parameters ($d=90, W=69.5\text{ kg}$)**:
   * $\text{BMR}(90) = (10 \times 69.5) + (6.25 \times 175) - (5 \times 30) + 5 = 695 + 1093.75 - 150 + 5 = 1643.75 \text{ kcal}$
   * $\text{TDEE}(90) = 1643.75 \times 1.55 = 2547.81 \text{ kcal}$
   * $\text{TargetKcal}(90) = 2548 - 838 = \mathbf{1710 \text{ kcal}}$ (Approx ~1700 kcal)
   * **Macros Day 90**:
     * Protein: $69.5 \times 2.1 \approx \mathbf{146 \text{ g}}$ ($584 \text{ kcal}$)
     * Fat: $69.5 \times 0.8 \approx \mathbf{56 \text{ g}}$ ($504 \text{ kcal}$)
     * Carb: $\frac{1710 - (584 + 504)}{4} \approx \mathbf{155 \text{ g}}$

---

## 4. 7700 kcal/kg Rule Assumptions & Physiological Limits

* **7700 kcal Rule Assumption**: Assumes adipose tissue composition is approximately 87% pure lipid (1 kg adipose = ~7,700 kcal of stored energy).
* **1.0% Bodyweight/Week Ceiling**: Weight loss exceeding 1.0% of total body weight per week significantly increases muscle protein breakdown, lowers thyroid hormone output (T3), and elevates cortisol. Cut 90 triggers a warning when planned loss exceeds this rate.
* **BMR Floor Rule**: Calorie intake is never permitted to drop below the user's calculated BMR to prevent severe metabolic adaptation and nutritional deficiencies.
