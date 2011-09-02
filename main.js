$(document).ready(function(){

	

  $("#loan_amount").val('600000');
  //var loan_amount=$("#loan_amount").val();
 
  
  // initialise variables
 	var loan_amount=$("#loan_amount").val();
	var loan_year=$("#loan_year").val();
	var frequency=$("#loan_repaymentFrequency").val();
	var loan_repaymentType=$("#loan_repaymentType").val();
	var loan_interest=$("#loan_interest").val();
	
	calculateRepayment(loan_amount,loan_year,frequency,loan_repaymentType,loan_interest);
	//drawGraph(loan_amount,loan_year,frequency,loan_repaymentType,loan_interest);
 
 $("#button1").click(function(){
	 $("#placeholder").fadeOut(1);
	//update the form value
	 loan_amount=$("#loan_amount").val();
	 loan_year=$("#loan_year").val();
	 frequency=$("#loan_repaymentFrequency").val();
	 loan_repaymentType=$("#loan_repaymentType").val();
	 loan_interest=$("#loan_interest").val();
	 //call the function again
	calculateRepayment(loan_amount,loan_year,frequency,loan_repaymentType,loan_interest);	
	 $("#placeholder").show(1000);
});
	
	
  

});

	function calculateRepayment(loan_amount,loan_year,frequency,loan_repaymentType,loan_interest){
	
		var period=0; var power=0; var term_interest=0; var payment=0;
	
	if (frequency=="Weekly"){
		period=52;
		}
	if (frequency=="Fortnightly"){
		period=26;
		}
	if (frequency=="Monthly"){
		period=12;
		}
	
	power=loan_year*period;
	
	term_interest=loan_interest/(period*100);
	//alert(term_interest);
	payment=Math.round(loan_amount*term_interest*Math.pow((1+term_interest),power)/(Math.pow((1+term_interest),power)-1));

	/*$text = "{\n".'"amount": "'.$amount.'",'."\n".'"mortgage": "'.$mortgage.'",'."\n".'"interest": "'.$interest.'",'."\n".'"frequency": "'.$frequency.'",'."\n".'"rtype": "'.$rtype.'",'."\n".'"payment": "'.$payment.'"'."\n}";

	file_put_contents('Result.json', $text);
	*/

	$("#_mortgage_repayment_pay").html(function(){
				return "Your "+frequency.toLowerCase()+" mortgage repayment is<br /><h2>"+"$"+payment+"</h2>";
										});
	drawGraph(loan_amount,loan_year,loan_interest,frequency,loan_repaymentType);

	//echo "Your ".strtolower(frequency)." mortgage repayment<br /><h2>$".payment."</h2>";
	
  }
				
	
	function drawGraph(amount,mortgage,interest,frequency,rtype){
					
					var plot;
					$(function(){
						var payment=0,period=0,result1=[],result2=[];
						if (frequency=="Weekly"){
							period=52;
						}
						else if (frequency=="Fortnightly"){
							period=26;
						}
						else if (frequency=="Monthly"){
							period=12;
						}
						
						var a=interest/(period*100);
						var power=mortgage*period;
						payment=amount*a*Math.pow((1+a),power)/(Math.pow((1+a),power)-1);
						var total_repayment=payment*mortgage*period;
						var interest_only_payment=amount*a;
						var interest_only_total_repayment=1*amount+interest_only_payment*period*mortgage;
						for (var i=0;i<=mortgage;i++){
							if (rtype=="Principal & Interest"){
								result1.push([i,Math.round(total_repayment-i*payment*period)]);
							}
							if (rtype=="Interest Only"){
								result1.push([i,Math.round(interest_only_total_repayment-i*interest_only_payment*period)])}
							}
						
						for (var j=0;j<=power;j++){
							if (rtype=="Principal & Interest"){
								if (j%period==0){
									var a1=Math.pow((1+a),j)*amount;
									var a2=Math.pow((1+a),j)-1;
									var a3=a2*payment/a;
									var a4=a1-a3;
									result2.push([j/period,Math.round(a4)]);
								}
							}
							if (rtype=="Interest Only"){
								if (j%period==0){
									result2.push([j/period,amount]);
								}	
							}
						}
						
						
						
						
						plot=$.plot($("#placeholder"), 
						[ {
							data: result1,
						    color: "#06f206",
						   lines: {  fill: true } 
						   },
						   {
							   data: result2,
							   color:"#028802",
							   lines: {   fill: true } 
						   }
						   ], 
						   
						   { 
							series:{
								lines: { show:true}
								},


							crosshair: { mode: "x", lineWidth:10 },
							grid: { hoverable:true, autoHighlight: false},
							//xaxis: { min: 0},

							yaxis: { min: 0, 
									position:"left" ,
									tickFormatter: function(val,axis){
														if(val>=1000000)
															return (val/1000000).toFixed(2)+"M";
														else if(val==0)
															return val;
														
														else if(val>1000&val<1000000)
															return (val/1000).toFixed(0)+"K";
														else
															return val;
														
														}
									}
							});
					
								
						var legends = $("#placeholder.legendLabel");
    					legends.each(function () {

        				// fix the widths so they don't jump around

        				$(this).css('width', $(this).width());

    					});
									
						var updateLegendTimeout = null;

    					var latestPosition = null;

    

    					function updateLegend() {

        					updateLegendTimeout = null;
        					var pos = latestPosition;
        
							var axes = plot.getAxes();

        					//if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||pos.y < axes.yaxis.min || pos.y > axes.yaxis.max)

            				//return;
							
							
							var value1=result1[Math.round(pos.x)][1];
							var value2=result2[Math.round(pos.x)][1];
							var value3=mortgage-Math.round(pos.x);
							
							if (value2<=0||value1<=0){
								value1=1;
								value2=1;}
							var test=value2/value1*100;
							var value=value2/value1*250;
							if (rtype=="Principal & Interest"){
								$("#x").text(Math.round(test)+"% home laon");
								$("#y").text(Math.round(100-test)+"% interest");
								$("#_box").width(value);
							}
							else if(rtype=="Interest Only"){
								$("#x").text("0% home loan");
								$("#y").text("100% interest");
								$("#_box").width(0);
								}
							$("#_remain_year").text(value3);
						}
						
						
						
						
						$("#placeholder").bind("plothover", function (event, pos, item) {							
							latestPosition = pos;
							   /*if (item) {
									  highlight(item.series, item.datapoint);
									  alert("You clicked a point!");
									}*/
							if (!updateLegendTimeout)
            					updateLegendTimeout = setTimeout(updateLegend, 50);
							
						});
						});
					
				}