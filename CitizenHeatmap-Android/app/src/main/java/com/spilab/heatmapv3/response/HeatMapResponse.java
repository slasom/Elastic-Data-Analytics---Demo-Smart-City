package com.spilab.heatmapv3.response;


import com.google.gson.annotations.SerializedName;

import java.util.Date;


public class HeatMapResponse {

    @SerializedName("resource")
    private String resource;

    @SerializedName("method")
    private String method;

    @SerializedName("params")
    private Params params;

    @SerializedName("sender")
    private String sender;

    @SerializedName("idRequest")
    private String idRequest;

    @SerializedName("analyticID")
    private String analyticID;

    public String getIdRequest() {
        return idRequest;
    }

    public void setIdRequest(String idRequest) {
        this.idRequest = idRequest;
    }

    public String getAnalyticID() {
        return analyticID;
    }

    public void setAnalyticID(String analyticID) {
        this.analyticID = analyticID;
    }

    public String getResource() {
        return resource;
    }

    public void setResource(String resource) {
        this.resource = resource;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public Params getParams() {
        return params;
    }

    public void setParams(Params params) {
        this.params = params;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getSender() {
        return sender;
    }

    public class Params {

        @SerializedName("beginDate")
        private Date beginDate;


        @SerializedName("endDate")
        private Date endDate;


        @SerializedName("latitude")
        private Double latitude;


        @SerializedName("longitude")
        private Double longitude;


        @SerializedName("radius")
        private Double radius;

        @SerializedName("devices")
        private Integer devices;

        @SerializedName("analyticID")
        private Integer analyticID;

        @SerializedName("freshness")
        private String freshness;

        @SerializedName("accuracy")
        private String LOW;





        public Date getbeginDate() {
            return beginDate;
        }


        public Date getendDate() {
            return endDate;
        }


        public Double getlatitude() {
            return latitude;
        }


        public Double getlongitude() {
            return longitude;
        }


        public Double getradius() {
            return radius;
        }


        public Integer getdevices() {
            return devices;
        }




    }


}



