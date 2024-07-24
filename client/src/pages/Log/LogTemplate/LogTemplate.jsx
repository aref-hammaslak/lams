import "./LogTemplate.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import {
	Modal,
	Form,
	Table,
	Row,
	Col,
	FloatingLabel,
	Button,
} from "react-bootstrap";
import React, { useEffect, useReducer, useState } from "react";

function modalReducer(state, action) {
	switch (action.type) {
		case "close":
			return {
				open: false,
			};
		case "edit":
			return {
				mode: "edit",
				open: true,
				i: action.i,
			};
		case "create":
			return {
				mode: "create",
				open: true,
			};
	}
}
function LogTemplate() {
	const [state, dispatch] = useReducer(modalReducer, { open: false });
	return (
		<>
			<div className="generic-add-Mbtn-frame">
				<button onClick={() => dispatch({ type: "create" })}>create</button>
			</div>
			<div className="logTemp-table-container">
				<Table className="logTemp-table" striped bordered hover responsive>
					<thead>
						<tr className="generic-tableFirstrow">
							<th>Equipment Name</th>
							<th>Log Type</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>CoverSlipper</td>
							<td>Daily log</td>
							<td>
								<FontAwesomeIcon
									icon={faPenToSquare}
									size="xl"
									style={{ color: "#161212" }}
									className="logTemp-table-icon"
								/>
							</td>
						</tr>
						<tr>
							<td>WaterBath</td>
							<td>Monthly log</td>
							<td>
								<FontAwesomeIcon
									icon={faPenToSquare}
									size="xl"
									style={{ color: "#161212" }}
									className="logTemp-table-icon"
								/>
							</td>
						</tr>
						<tr>
							<td>Hood</td>
							<td>Daily log</td>
							<td>
								<FontAwesomeIcon
									icon={faPenToSquare}
									size="xl"
									style={{ color: "#161212" }}
									className="logTemp-table-icon"
								/>
							</td>
						</tr>
					</tbody>
				</Table>
			</div>
			<Modal
				show={state.open}
				onHide={() => dispatch({ type: "close" })}
				size="lg"
			>
				<Form>
					<Modal.Body className="logTempModal-modal-body">
						<Row>
							<Col>
								<FloatingLabel label="Equipment Name">
									<Form.Select name="dep_id">
										<option value="none" disabled hidden>
											Select...
										</option>
									</Form.Select>
								</FloatingLabel>
							</Col>
						</Row>
						<Row>
							<Col>
								<FloatingLabel label="Log Type">
									<Form.Select name="dep_id">
										<option value="none" disabled hidden>
											Select...
										</option>
									</Form.Select>
								</FloatingLabel>
							</Col>
						</Row>
						<Row>
							<Col>
								<FloatingLabel label="Item">
									<Form.Control type="text" name="model_no" />
								</FloatingLabel>
							</Col>
							<Col>
								<FloatingLabel label="Item Type">
									<Form.Select name="dep_id">
										<option value="none" disabled hidden>
											Select...
										</option>
									</Form.Select>
								</FloatingLabel>
							</Col>
							<Col>
								<Button size="lg">+</Button>
							</Col>
						</Row>

						<Row>
							<Col>
								<div className="logTempModal-table-container">
									<Table
										className="logTempModal-table"
										striped
										bordered
										hover
										responsive
									>
										<thead>
											<tr className="generic-tableFirstrow">
												<th>Item</th>
												<th>Item Type</th>
												<th>Delete</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>Number of Cassettes</td>
												<td>Number Only</td>
												<td>
													<FontAwesomeIcon
														icon={faTrashCan}
														size="xl"
														style={{ color: "#161212" }}
													/>
												</td>
											</tr>
											<tr>
												<td>Perform the Retort Clean Cycle</td>
												<td>CheckBox</td>
												<td>
													<FontAwesomeIcon
														icon={faTrashCan}
														size="xl"
														style={{ color: "#161212" }}
													/>
												</td>
											</tr>
											<tr>
												<td>Paraffine temperature</td>
												<td>Number Only</td>
												<td>
													<FontAwesomeIcon
														icon={faTrashCan}
														size="xl"
														style={{ color: "#161212" }}
													/>
												</td>
											</tr>
										</tbody>
									</Table>
								</div>
							</Col>
						</Row>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="success" size="lg" type="submit">
							Save
						</Button>
						<Button
							variant="danger"
							size="lg"
							onClick={() => dispatch({ type: "close" })}
						>
							Cancel
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	);
}
export default LogTemplate;
