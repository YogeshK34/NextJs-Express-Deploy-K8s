#!/bin/bash

echo "🚀 Starting Minikube..."
minikube start

echo "📦 Creating ArgoCD namespace..."
kubectl create namespace argocd || true

echo "📥 Installing ArgoCD components..."
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

echo "⌛ Waiting for ArgoCD pods to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/argocd-server -n argocd

echo "🌐 Port forwarding ArgoCD UI..."
kubectl port-forward svc/argocd-server -n argocd 8080:443 &
sleep 5
echo "🔑 Default login is admin / use the base64 password from: kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d"

echo "📄 Applying ArgoCD app manifest..."
kubectl apply -f ./k8s/argocd-app.yaml

echo "✅ Done! Visit ArgoCD UI at http://localhost:8080"
