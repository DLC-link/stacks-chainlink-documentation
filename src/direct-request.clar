;; example consumer-contract
;; deployed to ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.direct-request on testnet

(define-data-var data-value (optional (buff 128)) none)

(impl-trait .oracle-callback-trait.oracle-callback)
(use-trait oracle-callback .oracle-callback-trait.oracle-callback)

(impl-trait .stxlink-transfer-trait.stxlink-transfer-trait)
(use-trait stxlink-transfer-trait .stxlink-transfer-trait.stxlink-transfer-trait)

(define-public (oracle-callback-handler (value  (optional (buff 128))))
  (ok (var-set data-value value)))

(define-read-only (read-data-value)
  (var-get data-value))

(define-public (create-request                    
                    (job-spec-id (buff 66)) 
                    (sender-id-buff (buff 84)) 
                    (data (buff 1024))
                    (oracle-address principal)
                    (stxlink-transfer-callback <stxlink-transfer-trait>) 
                    (oracle-fullfillment-callback <oracle-callback>))                  
  (contract-call? 
    .stxlink-token 
    transfer-and-call
    job-spec-id
    sender-id-buff
    data
    oracle-address
    stxlink-transfer-callback
    oracle-fullfillment-callback )) 


(define-public (transfer-success
                (payment uint)
                (job-spec-id (buff 66)) 
                (sender-id-buff (buff 84)) 
                (data (buff 1024))
                (callback <oracle-callback>))              
  (contract-call?
    .oracle                 ;; oracle name
    oracle-request          ;; oracle method
    tx-sender               ;; this contract's address
    job-spec-id             ;; chainlink-job id
    sender-id-buff          ;; transaction-sender-id encoded to buffer 
    callback                ;; callback principal (addr) 
    payment                 ;; payment
    u0                      ;; nonce
    u0                      ;; data version
    data))                  ;;data


(define-public (transfer-failure (error uint))
  (ok error))