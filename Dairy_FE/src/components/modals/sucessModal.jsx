import React, { useState } from 'react'
import {
    CModal,
    CModalBody,
    CModalFooter,
    CButton,
} from '@coreui/react';
import sucess from '../../assetes/Successfully.gif'
function SucessModal({ visiblePin, setVisiblePin }) {
    return (
        <div >
            <CModal
                visible={visiblePin}
                alignment="center"
                onClose={() => setVisiblePin(false)}
                aria-labelledby="LiveDemoExampleLabel"
            >
                <CModalBody>
                    <div className="container">
                        <img src={sucess} className='img-fluid' alt="Image Not Found!" />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton  color="danger" onClick={() => setVisiblePin(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    )
}

export default SucessModal