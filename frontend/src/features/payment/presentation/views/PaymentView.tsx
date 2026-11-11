import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Loading } from "../../../../components/common";
import { useAuth } from "../../../../hooks/useAuth";
import { usePaymentDi } from "../../di/PaymentContainer";
import { Plan } from "../../domain/entities/Plan";
import { PaymentMethod } from "../../domain/entities/PaymentMethod";

const PaymentView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPaymentUseCase } = usePaymentDi(); // Dùng DI hook
  
  const [plan, setPlan] = useState<Plan | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const storedPlan = localStorage.getItem("selected_premium_plan");
    if (storedPlan) {
      setPlan(JSON.parse(storedPlan));
    } else {
      navigate("/premium");
    }
  }, [navigate]);

  const handlePayment = async () => {
    if (!selectedMethod || !plan) return;

    try {
      setIsProcessing(true);
      
      // Gọi qua Lớp Use Case (Application Rules), không gọi trực tiếp Repository
      const paymentUrl = await createPaymentUseCase.execute(
        selectedMethod, 
        plan.id, 
        plan.price, 
        plan.title, 
        user?.id
      );

      // Redirect đến VNPay / MoMo
      window.location.href = paymentUrl;

    } catch (error: any) {
      alert(error.response?.data?.error || error.message || "Đã có lỗi xảy ra. Vui lòng thử lại!");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!plan)
    return (
      <div className="p-5 text-center">
        <Loading />
      </div>
    );

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="d-flex align-items-center mb-4">
            <button
              className="btn btn-light rounded-circle me-3 shadow-sm"
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            <h3 className="fw-bold mb-0">Thanh Toán</h3>
          </div>

          <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-body p-4">
              <h6
                className="text-muted text-uppercase fw-bold mb-3"
                style={{ fontSize: "0.8rem" }}
              >
                Chi tiết đơn hàng
              </h6>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-semibold">Gói Nâng Cấp</span>
                <span className="fw-bold text-warning bg-warning bg-opacity-10 px-2 py-1 rounded">
                  Premium {plan.title}
                </span>
              </div>
              
              {plan.discount ? (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted">Số tiền gói</span>
                    <span className="text-muted text-decoration-line-through">
                      {plan.id === '6_months' ? '594,000đ' : plan.id === '12_months' ? '1,188,000đ' : ''}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted">Giảm giá</span>
                    <span className="text-success fw-medium">
                      -{plan.id === '6_months' ? '95,000đ' : plan.id === '12_months' ? '289,000đ' : ''} ({plan.discount})
                    </span>
                  </div>
                </>
              ) : (
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted">Số tiền gói</span>
                  <span className="text-muted">
                    {plan.priceLabel}
                  </span>
                </div>
              )}
              
              <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-2">
                <span className="fw-semibold fs-5">Tổng tiền</span>
                <span className="fw-bold text-danger fs-4">
                  {plan.priceLabel}
                </span>
              </div>
            </div>
          </div>

          <h6 className="fw-bold mb-3 px-2">Phương thức thanh toán</h6>
          <div className="d-flex flex-column gap-3 mb-5">
            {/* MoMo */}
            <div
              className={`card border-2 rounded-4 cursor-pointer transition-all ${
                selectedMethod === "momo"
                  ? "border-primary bg-primary bg-opacity-10"
                  : "border-light bg-white hover-shadow"
              }`}
              onClick={() => setSelectedMethod("momo")}
            >
              <div className="card-body d-flex align-items-center p-3">
                <div
                  className="rounded p-2 me-3 d-flex align-items-center justify-content-center"
                  style={{ width: "50px", height: "50px", background: "#f8f9fa" }}
                >
                  <img
                    src="https://developers.momo.vn/v3/assets/images/square-8c08a00f550e40a2efafea4a005b1232.png"
                    alt="MoMo"
                    className="img-fluid rounded"
                  />
                </div>
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0">Ví MoMo</h6>
                  <small className="text-muted">Thanh toán qua ứng dụng MoMo</small>
                </div>
                <div>
                  <div
                    className={`rounded-circle border ${
                      selectedMethod === "momo"
                        ? "border-primary bg-primary"
                        : "border-secondary"
                    }`}
                    style={{ width: "20px", height: "20px" }}
                  >
                    {selectedMethod === "momo" && (
                      <i className="bi bi-check text-white d-flex align-items-center justify-content-center h-100 fs-6"></i>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* VNPAY */}
            <div
              className={`card border-2 rounded-4 cursor-pointer transition-all ${
                selectedMethod === "vnpay"
                  ? "border-primary bg-primary bg-opacity-10"
                  : "border-light bg-white hover-shadow"
              }`}
              onClick={() => setSelectedMethod("vnpay")}
            >
              <div className="card-body d-flex align-items-center p-3">
                <div
                  className="rounded p-2 me-3 d-flex align-items-center justify-content-center"
                  style={{ width: "50px", height: "50px", background: "#f8f9fa" }}
                >
                  <img
                    src="https://vnpay.vn/assets/images/logo-icon/logo-primary.svg"
                    alt="VNPAY"
                    className="img-fluid"
                  />
                </div>
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0">VNPAY</h6>
                  <small className="text-muted">Thẻ ATM, Ngân hàng nội địa</small>
                </div>
                <div>
                  <div
                    className={`rounded-circle border ${
                      selectedMethod === "vnpay"
                        ? "border-primary bg-primary"
                        : "border-secondary"
                    }`}
                    style={{ width: "20px", height: "20px" }}
                  >
                    {selectedMethod === "vnpay" && (
                      <i className="bi bi-check text-white d-flex align-items-center justify-content-center h-100 fs-6"></i>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Visa / Mastercard */}
            <div
              className={`card border-2 rounded-4 cursor-pointer transition-all ${
                selectedMethod === "card"
                  ? "border-primary bg-primary bg-opacity-10"
                  : "border-light bg-white hover-shadow"
              }`}
              onClick={() => setSelectedMethod("card")}
            >
              <div className="card-body d-flex align-items-center p-3">
                <div
                  className="rounded p-2 me-3 d-flex align-items-center justify-content-center bg-white border"
                  style={{ width: "50px", height: "50px" }}
                >
                  <img
                    src="https://cdn.jsdelivr.net/gh/gilbarbara/logos@2024.04/logos/visa.svg"
                    alt="Visa"
                    style={{ height: "16px", marginRight: "8px" }}
                  />
                  <img
                    src="https://cdn.jsdelivr.net/gh/gilbarbara/logos@2024.04/logos/mastercard.svg"
                    alt="Mastercard"
                    style={{ height: "20px" }}
                  />
                </div>
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0">Thẻ Tín Dụng / Ghi Nợ</h6>
                  <small className="text-muted">Visa, Mastercard, JCB</small>
                </div>
                <div>
                  <div
                    className={`rounded-circle border ${
                      selectedMethod === "card"
                        ? "border-primary bg-primary"
                        : "border-secondary"
                    }`}
                    style={{ width: "20px", height: "20px" }}
                  >
                    {selectedMethod === "card" && (
                      <i className="bi bi-check text-white d-flex align-items-center justify-content-center h-100 fs-6"></i>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* PayPal */}
            <div
              className={`card border-2 rounded-4 cursor-pointer transition-all ${
                selectedMethod === "paypal"
                  ? "border-primary bg-primary bg-opacity-10"
                  : "border-light bg-white hover-shadow"
              }`}
              onClick={() => setSelectedMethod("paypal")}
            >
              <div className="card-body d-flex align-items-center p-3">
                <div
                  className="rounded p-2 me-3 d-flex align-items-center justify-content-center bg-white border"
                  style={{ width: "50px", height: "50px" }}
                >
                  <img
                    src="https://cdn.jsdelivr.net/gh/gilbarbara/logos@2024.04/logos/paypal.svg"
                    alt="PayPal"
                    className="img-fluid"
                  />
                </div>
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0">PayPal</h6>
                  <small className="text-muted">Thanh toán quốc tế</small>
                </div>
                <div>
                  <div
                    className={`rounded-circle border ${
                      selectedMethod === "paypal"
                        ? "border-primary bg-primary"
                        : "border-secondary"
                    }`}
                    style={{ width: "20px", height: "20px" }}
                  >
                    {selectedMethod === "paypal" && (
                      <i className="bi bi-check text-white d-flex align-items-center justify-content-center h-100 fs-6"></i>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-grid">
            <Button 
              variant={selectedMethod ? "primary" : "secondary"} 
              size="lg" 
              className="rounded-pill shadow fw-bold text-white fs-5 py-3"
              onClick={handlePayment}
              disabled={!selectedMethod || isProcessing}
              style={selectedMethod ? { background: 'linear-gradient(45deg, #0d6efd, #0dcaf0)', border: 'none' } : {}}
            >
              {isProcessing ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                'Thanh Toán Ngay'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentView;
