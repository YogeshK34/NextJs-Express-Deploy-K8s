
# Next.js & Express.js Deployment on Kubernetes with ArgoCD

This repository demonstrates a full-stack application using **Next.js** (frontend) and **Express.js** (backend), deployed on a **Kubernetes** (Minikube) cluster with **ArgoCD** for GitOps-style continuous deployment.

## Architecture

- **Frontend**: Built with Next.js and deployed in a Kubernetes pod.
- **Backend**: Built with Express.js and deployed in a Kubernetes pod.
- **Kubernetes Cluster**: Managed with Minikube locally.
- **ArgoCD**: Automates GitOps workflows to deploy updates directly from the GitHub repository.

## Prerequisites

1. **Minikube**: For local Kubernetes cluster.
2. **Kubectl**: To interact with your Kubernetes cluster.
3. **ArgoCD**: Installed in your cluster for GitOps.
4. **GitHub**: For hosting the repo and enabling ArgoCD integration.

## Setup Instructions

### 1. Start Minikube Cluster

```bash
minikube start
```

### 2. Install ArgoCD

Run the following commands to install ArgoCD in the `argocd` namespace:

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### 3. Expose ArgoCD UI

Use port-forwarding to access the ArgoCD UI:

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Access the UI at `http://localhost:8080`. The default credentials are:

- **Username**: `admin`
- **Password**: Retrieve it with the following command:
  ```bash
  kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d
  ```

### 4. Create ArgoCD Application

In ArgoCD UI:
1. Click **New App**.
2. Set **App Name** (e.g., `nextjs-express-app`).
3. Set **Project** to `default`.
4. In **Source**:
   - **Repo URL**: `https://github.com/YogeshK34/NextJs-Express-Deploy-K8s`
   - **Path**: `k8s`
   - **Target Revision**: `main`
5. In **Destination**:
   - **Cluster URL**: `https://kubernetes.default.svc`
   - **Namespace**: `default`
6. Enable **Auto-Sync** for automatic deployments.

### 5. Deploy Application

Your application should now automatically sync and deploy the frontend and backend to your Kubernetes cluster.

### 6. Run the Setup Script (for automation)

Run the `setup.sh` script to automatically set up Minikube, install ArgoCD, and configure the app for ArgoCD:

```bash
chmod +x setup.sh
./setup.sh
```

The script will:
1. Start the Minikube cluster.
2. Install ArgoCD and set it up for the project.
3. Create the ArgoCD app for auto-sync.

### 7. Visit the Application

Once the deployment is successful, visit your application at the following URL (exposed via ArgoCD sync):

```bash
http://localhost:8080
```

## Additional Information

- This setup demonstrates GitOps by automatically deploying updates directly from GitHub to your Kubernetes cluster using ArgoCD.
- Make sure to push any changes to the `k8s` directory in your repository to trigger an automatic deployment.

## Troubleshooting

If you face any issues with syncing or app health:
- Ensure Minikube is running: `minikube status`
- Check ArgoCD pod status: `kubectl get pods -n argocd`
- Reapply ArgoCD resources if needed: `kubectl apply -f k8s/argocd-app.yaml`
