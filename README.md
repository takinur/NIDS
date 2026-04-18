# NIDS-FSL — Network Intrusion Detection with Few-Shot Learning

A web-based Network Intrusion Detection System (NIDS) that uses **Few-Shot Learning (FSL)** via a **Siamese Neural Network** to classify network traffic with minimal labelled examples.

Built on the **CICIDS2017** dataset and presented through a **FastAPI** backend + **Next.js** dashboard.

---

## Overview

Traditional intrusion detection models need large amounts of labelled attack data to train. This project explores a **Few-Shot** approach — the Siamese network learns a similarity function between traffic flows, so it can identify new attack classes from just a handful of examples.

| Component | Technology |
|-----------|-----------|
| ML Model | Siamese Neural Network (TensorFlow/Keras) |
| Dataset | CICIDS2017 (Wednesday capture) |
| Backend API | FastAPI + Uvicorn |
| Frontend | Next.js 15 + TypeScript + Tailwind CSS |
| Containerisation | Docker + Docker Compose |

---

## Model Architecture

```
Flow A ──► [Dense 64 → BatchNorm → Dense 128 → Dense 64] ──►│
                                                              ├─► |A - B| ──► Dense 1 (sigmoid)
Flow B ──► [Dense 64 → BatchNorm → Dense 128 → Dense 64] ──►│
```

- **Input**: 49 network-flow features (from CICFlowMeter, after feature selection)
- **Output**: Similarity score in `[0, 1]` — close to `1` means same traffic class
- **Training**: 10% / 90% train-test split (extreme few-shot scenario), 50 epochs, Adam + Binary Cross-Entropy

### Selected Features (49)

After dropping 29 low-signal features, the model uses:

> Destination Port, Flow Duration, Total Fwd/Bwd Packets, Bwd Packet Length stats, Flow Bytes/s, Flow Packets/s, Flow/Fwd/Bwd IAT stats, Header Lengths, Packet Length stats, Subflow stats, Active/Idle stats, and more.

---

## Project Structure

```
NIDS/
├── backend/
│   ├── main.py              # FastAPI app + routes
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx     # Dashboard homepage
│   │   │   └── layout.tsx
│   │   └── lib/
│   │       └── api.ts       # API client
│   ├── package.json
│   ├── next.config.ts
│   └── Dockerfile
├── docker-compose.yml
└── TKNR_FSL_SIA_Baseline.ipynb   # Original training notebook
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 20+
- (Optional) Docker + Docker Compose

---

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
uvicorn main:app --reload
```

API will be running at **http://localhost:8000**
Interactive docs at **http://localhost:8000/docs**

---

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Dashboard will be running at **http://localhost:3000**

---

### 3. Docker (both together)

```bash
docker-compose up --build
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Root / info |
| `GET` | `/health` | Health check |
| `POST` | `/predict` | Classify a network flow |

### Example Request

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"Flow Duration": 1200, "Total Fwd Packets": 5, ...}'
```

### Example Response

```json
{
  "predicted_class": "BENIGN",
  "confidence": 0.87
}
```

---

## Dataset

**CICIDS2017** — Canadian Institute for Cybersecurity Intrusion Detection Evaluation Dataset.

- Capture day used: **Wednesday** (DoS Slowloris, DoS Slowhttptest, DoS Hulk, DoS GoldenEye, Heartbleed)
- Sample used for baseline: `Wednesday_200.csv` (200 samples)
- Labels: `BENIGN` + various DoS attack types

Download the full dataset from the [UNB CIC website](https://www.unb.ca/cic/datasets/ids-2017.html).

Place the CSV in `backend/data/` before training.

---

## Training

Open and run the notebook in Google Colab or Jupyter:

```
TKNR_FSL_SIA_Baseline.ipynb
```

After training, export and save:
- `backend/models/siamese_model.keras`
- `backend/models/scaler.joblib`

---

## Roadmap

- [ ] Wire up saved model to `/predict` endpoint
- [ ] Add support-set based few-shot classification endpoint
- [ ] Upload CSV for batch prediction in the dashboard
- [ ] Live traffic capture via CICFlowMeter integration
- [ ] Charts: confusion matrix, per-class confidence, training history
- [ ] Authentication for the dashboard

---

## Team

**TKNR** — FSL / Siamese Network research group, BRACU.

---

## License

MIT
