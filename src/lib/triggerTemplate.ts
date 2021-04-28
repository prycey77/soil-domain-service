const event = (file: string) => {
  return {
    Records: [
      {
        eventVersion: "2.1",
        eventSource: "aws:s3",
        awsRegion: "eu-west-2",
        eventTime: "2021-04-15T14:06:51.007Z",
        eventName: "ObjectCreated:Put",
        userIdentity: {
          principalId: "AWS:AROATest@test.com",
        },
        requestParameters: {
          sourceIPAddress: "80.3.68.152",
        },
        responseElements: {
          "x-amz-request-id": "MHDGD5B2D",
          "x-amz-id-2": "bSrRfPYIy/csOqi3oGYa4aGZvnh+tKggpL7TLt9Qyz/ShvZ",
        },
        s3: {
          s3SchemaVersion: "1.0",
          configurationId: "0f60ce7e-7b4e02b",
          bucket: {
            name: "dummy-database",
            ownerIdentity: {
              principalId: "AW0PSDFSDFFDS",
            },
            arn: "arn:aws:s3:::eurofins-monitor-results",
          },
          object: {
            key: file,
            size: 385443,
            eTag: "0e8291dsdf4323244ccfcd",
            sequencer: "00607SDFSDFSFSD7A3",
          },
        },
      },
    ],
  };
};

export { event };
