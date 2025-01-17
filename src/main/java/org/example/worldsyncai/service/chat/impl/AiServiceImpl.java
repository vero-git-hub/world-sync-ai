package org.example.worldsyncai.service.chat.impl;

import com.google.cloud.aiplatform.v1.EndpointName;
import com.google.cloud.aiplatform.v1.PredictRequest;
import com.google.cloud.aiplatform.v1.PredictResponse;
import com.google.cloud.aiplatform.v1.PredictionServiceClient;
import com.google.protobuf.Value;
import lombok.extern.slf4j.Slf4j;
import org.example.worldsyncai.service.chat.AiService;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
@Slf4j
public class AiServiceImpl implements AiService {

    @org.springframework.beans.factory.annotation.Value("${google.cloud.project-id}")
    private String projectId;

    @org.springframework.beans.factory.annotation.Value("${google.cloud.location}")
    private String location;

    @org.springframework.beans.factory.annotation.Value("${google.cloud.model-name}")
    private String modelName;

    @Override
    public String getAIResponse(String prompt) {
        try {
            PredictionServiceClient client = PredictionServiceClient.create();
            EndpointName endpoint = EndpointName.of(projectId, location, modelName);

            Map<String, Value> instanceMap = Map.of(
                    "prompt", Value.newBuilder().setStringValue(prompt).build()
            );

            PredictRequest request = PredictRequest.newBuilder()
                    .setEndpoint(endpoint.toString())
                    .addInstances(Value.newBuilder().setStructValue(com.google.protobuf.Struct.newBuilder()
                            .putAllFields(instanceMap)).build())
                    .build();

            PredictResponse response = client.predict(request);
            client.shutdown();

            return response.getPredictions(0).getStructValue().getFieldsOrThrow("text").getStringValue();
        } catch (IOException e) {
            log.error("Error calling AI model", e);
            return "Ошибка обработки запроса AI.";
        }
    }
}