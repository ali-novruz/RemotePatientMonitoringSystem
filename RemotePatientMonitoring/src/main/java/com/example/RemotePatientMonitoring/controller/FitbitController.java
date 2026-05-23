package com.example.RemotePatientMonitoring.controller;

import com.example.RemotePatientMonitoring.service.FitbitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

@RestController
@RequestMapping("/api/fitbit")
public class FitbitController {

    @Autowired
    private FitbitService fitbitService;

    @GetMapping("/authorize")
    public String getAuthorizationUrl(@RequestParam(required = false) Long patientId) {
        return fitbitService.getAuthorizationUrl(patientId);
    }

    @GetMapping("/callback")
    public RedirectView handleCallback(@RequestParam("code") String code, @RequestParam(value = "state", required = false) String state) {
        Long patientId = null;
        try {
            if (state != null && !state.equals("unknown")) {
                patientId = Long.parseLong(state);
            }
        } catch (NumberFormatException e) {
            // ignore
        }
        fitbitService.exchangeCodeForToken(code, patientId);
        return new RedirectView("http://localhost:5500/index.html?fitbitConnected=true");
    }

    @GetMapping("/heart-rate")
    public Map<String, Object> getHeartRateData(@RequestParam(required = false) Long patientId) {
        return fitbitService.getHeartRateData(patientId);
    }
    
    @GetMapping("/heart-rate/simulated")
    public Map<String, Object> getSimulatedHeartRateData() {
        return fitbitService.getSimulatedHeartRateData();
    }
}