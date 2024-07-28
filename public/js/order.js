// $(document).ready(function () {
//     function fetchOrders() {
//         $.ajax({
//             url: '/api/myorder',
//             type: 'GET',
//             success: function (response) {
//                 const ordersContainer = $('#orders');
//                 ordersContainer.empty();

//                 if (response.orders.length > 0) {
//                     // Sort orders by status
//                     const sortedOrders = response.orders.sort((a, b) => {
//                         const statusOrder = {
//                             'Processing': 1,
//                             'Shipped': 2,
//                             'Cancelled': 3,
//                             'Delivered': 4
//                         };
//                         return statusOrder[a.status] - statusOrder[b.status];
//                     });

//                     let lastStatus = '';

//                     sortedOrders.forEach(order => {
//                         let orderBorderClass = '';
//                         switch (order.status) {
//                             case 'Processing':
//                                 orderBorderClass = 'processing-order';
//                                 break;
//                             case 'Shipped':
//                                 orderBorderClass = 'shipped-order';
//                                 break;
//                             case 'Cancelled':
//                                 orderBorderClass = 'cancelled-order';
//                                 break;
//                             case 'Delivered':
//                                 orderBorderClass = 'delivered-order';
//                                 break;
//                         }
//                         if (lastStatus && lastStatus !== order.status) {
//                             ordersContainer.append('<div class="status-separator"></div>');
//                         }

//                         if (lastStatus !== order.status) {
//                             ordersContainer.append(`<div class="status-header text-center">${order.status}</div>`);
//                         }

//                         const productCards = order.products.map(product => `
//                             <div class="order-product mr-2">
//                                 <img src="${product.img_path.split(',')[0]}" alt="Product Image" style="object-fit: contain;">
//                                 <div class="details">
//                                     <h5><strong>${product.name}</strong></h5>
//                                     <p>${product.brand_name}</p>
//                                 </div>
//                             </div>
//                         `).join('');

//                         const orderCard = `
//                             <div class="card mt-3 ${orderBorderClass}">
//                                 <div class="card-header d-flex justify-content-between align-items-center">
//                                     <div>
//                                         <h6>Status: ${order.status}</h6>
//                                     </div>
//                                 </div>
//                                 <div class="card-body">
//                                     <div class="order-products">
//                                         ${productCards}
//                                     </div>
//                                     <p><strong>Total Amount:</strong> ₱${order.total_amount.toFixed(2)}</p>
//                                     ${order.status === 'Processing' ? `<button class="btn btn-danger cancel-order-btn" data-id="${order.id}">Cancel Order</button>` : ''}
//                                 </div>
//                             </div>
//                         `;

//                         ordersContainer.append(orderCard);
//                         lastStatus = order.status;
//                     });
//                 } else {
//                     ordersContainer.html('<p>No orders found.</p>');
//                 }
//             },
//             error: function (xhr, status, error) {
//                 $('#orders').html('<p>Error fetching orders.</p>');
//             }
//         });
//     }

//     function cancelOrder(orderId) {
//         $.ajax({
//             url: `/api/orders/${orderId}/cancel`,
//             type: 'PUT',
//             success: function (response) {
//                 fetchOrders(); // Refresh orders after cancellation
//                 alert('Order cancelled successfully.');
//             },
//             error: function (xhr, status, error) {
//                 alert('Error cancelling order.');
//             }
//         });
//     }

//     fetchOrders();

//     $(document).on('click', '.cancel-order-btn', function () {
//         const orderId = $(this).data('id');
//         if (confirm('Are you sure you want to cancel this order?')) {
//             cancelOrder(orderId);
//         }
//     });
// });
$(document).ready(function () {
    var csrfToken = $('meta[name="csrf-token"]').attr('content');
    // console.log('CSRF Token:', csrfToken);

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    });

    function showAlert(message, type) {
        const alertTypeClass = {
            success: 'custom-bootbox-success',
            error: 'custom-bootbox-error',
            warning: 'custom-bootbox-warning'
        };

        const alertIcon = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>'
        };

        const dialog = bootbox.dialog({
            message: `<div class="custom-bootbox-content ${alertTypeClass[type]}">
                        ${alertIcon[type]} <span>${message}</span>
                      </div>`,
            backdrop: true,
            closeButton: false,
            onShown: function () {
                setTimeout(function() {
                    dialog.modal('hide');
                }, 2000);
            }
        });

        dialog.on('shown.bs.modal', function() {
            setTimeout(function() {
                dialog.find('.custom-bootbox-content').fadeOut(2000, function() {
                    dialog.modal('hide');
                });
            }, 2000);
        });
    }

    function fetchOrders() {
        $.ajax({
            url: '/api/myorder',
            type: 'GET',
            success: function (response) {
                const ordersContainer = $('#orders');
                ordersContainer.empty();

                if (response.orders.length > 0) {
                    // Sort orders by status
                    const sortedOrders = response.orders.sort((a, b) => {
                        const statusOrder = {
                            'Processing': 1,
                            'Shipped': 2,
                            'Cancelled': 3,
                            'Delivered': 4
                        };
                        return statusOrder[a.status] - statusOrder[b.status];
                    });

                    let lastStatus = '';

                    sortedOrders.forEach(order => {
                        let orderBorderClass = '';
                        let statusBadge = '';
                        switch (order.status) {
                            case 'Processing':
                                orderBorderClass = 'border-primary';
                                statusBadge = 'badge-primary';
                                break;
                            case 'Shipped':
                                orderBorderClass = 'border-info';
                                statusBadge = 'badge-info';
                                break;
                            case 'Cancelled':
                                orderBorderClass = 'border-danger';
                                statusBadge = 'badge-danger';
                                break;
                            case 'Delivered':
                                orderBorderClass = 'border-success';
                                statusBadge = 'badge-success';
                                break;
                        }
                        if (lastStatus && lastStatus !== order.status) {
                            ordersContainer.append('<div style="height: 1px; background-color: #e0e0e0; margin: 20px 0;"></div>');
                        }

                        if (lastStatus !== order.status) {
                            ordersContainer.append(`<div style="text-align: center; margin-top: 20px;"><h4 style="text-transform: uppercase;">${order.status}</h4></div>`);
                        }

                        const productCards = order.products.map(product => `
                            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                <img src="${product.img_path.split(',')[0]}" alt="Product Image" style="width: 80px; height: 80px; object-fit: contain; border-radius: 5px; border: 1px solid #ddd; margin-right: 10px;">
                                <div>
                                    <h5><strong>${product.name}</strong></h5>
                                    <p>${product.brand_name}</p>
                                </div>
                            </div>
                        `).join('');

                        const orderCard = `
                            <div class="card mt-3 ${orderBorderClass}" style="margin-bottom: 20px;">
                                <div class="card-header" style="background-color: #f7f7f7;">
                                    <h6>Status: <span class="badge ${statusBadge}">${order.status}</span></h6>
                                </div>
                                <div class="card-body">
                                    <div style="margin-bottom: 20px;">
                                        ${productCards}
                                    </div>
                                    <p><strong>Total Amount:</strong> ₱${order.total_amount.toFixed(2)}</p>
                                    ${order.status === 'Processing' ? `<button class="btn btn-danger cancel-order-btn" data-id="${order.id}" style="margin-top: 10px;">Cancel Order</button>` : ''}
                                </div>
                            </div>
                        `;

                        ordersContainer.append(orderCard);
                        lastStatus = order.status;
                    });
                } else {
                    ordersContainer.html('<p style="text-align: center;">No orders found.</p>');
                }
            },
            error: function (xhr, status, error) {
                $('#orders').html('<p style="text-align: center; color: red;">Error fetching orders.</p>');
            }
        });
    }

    function cancelOrder(orderId) {
        $.ajax({
            url: `/api/orders/${orderId}/cancel`,
            type: 'PUT',
            success: function (response) {
                fetchOrders(); // Refresh orders after cancellation
                showAlert('Order cancelled successfully.');
            },
            error: function (xhr, status, error) {
                showAlert('Error cancelling order.');
            }
        });
    }

    fetchOrders();

    $(document).on('click', '.cancel-order-btn', function () {
        const orderId = $(this).data('id');
        if (confirm('Are you sure you want to cancel this order?')) {
            cancelOrder(orderId);
        }
    });
});
