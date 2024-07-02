pipeline {
    agent any

    stages {
        stage('Initialize') {
            steps {
                script {
                    sh 'docker stop ts-cms || true'
                    sh 'docker rm ts-cms || true'
                }
            }
        }

        stage('Clean Up') {
            steps {
                script {
                    sh 'docker rmi $(docker images ts-cms -q) || true'
                }
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                script {
                    sh 'docker build -t ts-cms .'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh '''
                    docker run -d \
                        --name ts-cms \
                        -p 3001:3001 \
                        ts-cms:latest
                    '''
                }
            }
        }
    }

    post {
        success {
            script {
                echo 'Deployment succeeded!'
            }
        }
    }
}


