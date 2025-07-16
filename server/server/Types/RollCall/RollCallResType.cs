namespace server.Types.RollCall
{
    public class RollCallResType
    {
        public int StatusCode { get; set; }

        public string Message { get; set; } = string.Empty;

        public RollCallRes? RollCallRes { get; set; }
        public List<RollCallRes>? ListRollCallDetailRes { get; set; }

        public Domain.Entities.RollCall? RollCall { get; set; }

        public List<Domain.Entities.RollCall>? ListRollCallRes { get; set; }

        public RollCallResType() { }

        public RollCallResType(int status, string message)
        {
            this.StatusCode = status;
            this.Message = message;
        }

        public RollCallResType(int status, string message, Domain.Entities.RollCall rollCall)
        {
            this.StatusCode = status;
            this.Message = message;
            this.RollCall = rollCall;
        }

        public RollCallResType(int status, string message, List<Domain.Entities.RollCall> listRollCallRes)
        {
            this.StatusCode = status;
            this.Message = message;
            this.ListRollCallRes = listRollCallRes;
        }

        public RollCallResType(int status, string message, List<RollCallRes> listRollCallDetailRes)
        {
            this.StatusCode = status;
            this.Message = message;
            this.ListRollCallDetailRes = listRollCallDetailRes;
        }
    }
}
